from flask import Flask, json, g, request
from app.idp.service import Service as IdentityService
from app.idp.schema import IdentitySchema

from app.puzzle.service import Service as PuzzleService
from app.puzzle.schema import PuzzleSchema

from app.game.service import Service as Game

app = Flask(__name__)
CORS(app)

# https://www.netlify.com/

# https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react

# Requires - int: elo
# Returns - puzzle
@app.route("/puzzle/<int:elo>", methods = ["GET", "POST"])
def puzzle(elo):
    if flask.request.method == 'GET':
        puzzle = PuzzleService(g.elo).get_puzzle(elo)

        if(puzzle):
            return json_response(puzzle)
        else:
            return json_response({'error': 'no puzzles found'}, 404)

    else if flask.request.method == 'POST':
        puzzle_req = PuzzleSchema().load(json.loads(request.data))

        if puzzle_req.errors:
            return json_response({'error': puzzle_req.error}, 422)
            
        puzzle = PuzzleService().create_puzzle(puzzle_req)
        return json_response(puzzle)

# Requires: username:string
# Returns: user: app.idp.user
@app.route("/user/<string:username>", methods = ["GET", "POST"]) 
def user(username)
    if flask.request.method == 'GET':
        user = IdentityService(g.user).get_user(username)

        if(user):
            return json_response(user)
        else:
            return json_response({'error': 'user not found'}, 404)
    
    else if flask.request.method == 'GET':
        user_req = IdentitySchema().load(json.loads(request.data))

        if user_req.errors:
            return json_response({'error': user_req.error}, 422)
            
        user = IdentityService().create_user(user_req)
        return json_response(user)

# POST:
# {
#   game_state
#   action: {
#       action_name: "DRAGGED_TO_BENCH",
#       cards_selected: [uuid],
#       target_object: uuid,
#       value: 0
#   }
# }
# RESPONSE:
# {
#   game_state
#   change: {
#       return_action: "",
#       card_uuid: "",
#       value: 0
#   }
# }

@app.route("/action/dragged_to_bench", methods = ["POST"])
def process_move():
    
@app.route("/action/enemies_selected", methods = ["POST"])
@app.route("/action/dragged_to_board", methods = ["POST"])
@app.route("/action/passed", methods = ["POST"])



# return: list of users and elo (up to 50)
@app.route("/leaderboards", methods = ["GET"])


# ____                   
# /    \			
#   u  u|      _______    
#     \ |  .-''#%&#&%#``-.   
#    = /  ((%&#&#&%&VK&%&))  
#     |    `-._#%&##&%_.-'   
#  /\/\`--.   `-."".-'
#  |  |    \   /`./          
#  |\/|  \  `-'  /
#  || |   \     /            VK
