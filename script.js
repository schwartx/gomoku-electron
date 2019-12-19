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
            this.currentPlayer = this.turn ? 'AI' : 'Human';
            this.turn ? this.board[parent][index] = whiteDisk : this.board[parent][index]= blackDisk;
            //
            if(this.turn) {
                pyshell.send(parent.toString() + ',' + index.toString());
                this.clickable = false;
            }
        },
        ai_drop: function(message) {
            let p = parseInt(message[0], 10);
            let i = parseInt(message[2], 10);
            this.clickable = true;
            this.dropPiece(i,p);
            if (message[6]==='2') {
                this.victory();
            }
        },
        isWhite: function(index,parent){
            return (this.board[parent][index] === whiteDisk);
        },
        isBlack: function(idx1,idx2){
            return !(this.turn == null) && (this.board[idx2][idx1] === blackDisk);
        },
        victory: function () {
            this.win = true;
            this.clickable = false;
            this.currentPlayer = 'Win';
            const playerBox = document.querySelector('.playerBox');
            playerBox.style.background = "red";
        }
    }
});

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
    game.ai_drop(message)
});