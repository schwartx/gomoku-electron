let {PythonShell} = require('python-shell');

let pyshell = new PythonShell('./pygomoku/play.py');

function createBoard(row, col){
    let a = [];
    for(let i=0; i < row; i++){
        a[i] = [];
        for(let j=0; j < col; j++){
            a[i][j] = null
        }
    } return a
}

const gameBoard = createBoard(8, 8);
const whiteDisk = 'w';
const blackDisk = 'b';
const playerBox = document.querySelector("#playerBox");

let game = new Vue({
    el: '#app',
    data: {
        board: gameBoard,
        turn: false,
        currentPlayer: 'Human',
        clickable: true,
        win: false
    },
    methods:{
        dropPiece: function(index, parent){
            if (!this.clickable ||this.board[parent][index]===whiteDisk || this.board[parent][index]===blackDisk) {
                return;
            }
            this.turn = !this.turn;
            if(this.turn) {
                this.clickable = false;
                playerBox.style.background = "#000";
                playerBox.style.color = "#FFF";
                pyshell.send(parent.toString() + ',' + index.toString());
            }
            else {
                playerBox.style.background = "#FFF";
                playerBox.style.color = "#000";
            }
            this.currentPlayer = this.turn ? 'AI' : 'Human';
            this.turn ? this.board[parent][index] = whiteDisk : this.board[parent][index]= blackDisk;
        },
        ai_drop: function(message) {
            let p = parseInt(message[0], 10);
            let i = parseInt(message[2], 10);
            this.clickable = true;
            if (message[4]==='1') {
                if (message[6]==='1') {
                    this.currentPlayer = 'Human';
                    this.victory();
                }
                else if (message[6]==='2') {
                    this.dropPiece(i,p);
                    this.currentPlayer = 'AI';
                    this.victory();
                }
                else {
                    this.draw();
                }
            }
            this.dropPiece(i,p);
        },
        isWhite: function(index,parent){
            return (this.board[parent][index] === whiteDisk);
        },
        isBlack: function(idx1,idx2){
            return !(this.turn == null) && (this.board[idx2][idx1] === blackDisk);
        },
        victory: function () {
            // this.win = true;
            this.clickable = false;
            this.currentPlayer += ' wins';
            playerBox.style.background = "red";
            playerBox.style.color = "#FFF";
        },
        draw: function () {
            this.clickable = false;
            this.currentPlayer = 'draw';
            playerBox.style.background = "red";
            playerBox.style.color = "#FFF";
        }
    }
});

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
    game.ai_drop(message)
});