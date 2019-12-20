import pickle

from game import Board, Game
from mcts_alphaZero import MCTSPlayer
from policy_value_net_numpy import PolicyValueNetNumpy
from human import Human

class Play:
    def __init__(self):
        policy_param = pickle.load(open('best_policy_8_8_5.model', 'rb'),
                                                            encoding='bytes')
        best_policy = PolicyValueNetNumpy(8, 8, policy_param)
        mcts_player = MCTSPlayer(best_policy.policy_value_fn, c_puct=10, n_playout=1000)
        human = Human()

        self.game = Game(Board(width=8, height=8, n_in_row=5), human, mcts_player)
        # self.turn = True

    def step(self, location=None):
        location, end, winner = self.game.play(location)
        end = 1 if end else 0
        return location, end, winner


p = Play()
turn = False
while True:
    turn = not turn
    if turn:
        location = input()
        location = [int(i) for i in location.split(',')]
    else:
        location = None

    location, end, winner = p.step(location)
    if not turn:
        print(location[0],location[1], end, winner)
    elif winner != -1:
        print(location[0],location[1], end, winner)
        break
