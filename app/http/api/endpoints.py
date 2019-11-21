from flask import Flask, json, g, request
from app.idp.service import Service as IdentityService
from app.idp.schema import IdentitySchema

from app.puzzle.service import Service as PuzzleService
from app.puzzle.schema import PuzzleSchema

from app.game.service import Service as Game

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# https://www.netlify.com/

# https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react
@app.route("/", methods = ["GET"])
def entry():
    return json_response({'yes': 'no'}, 200)
# Returns the next puzzle based on elo
@app.route("/puzzles/<int:elo>", methods = ["GET"])
def next_puzzle(elo):
    puzzles = PuzzleService().find_all_puzzles()
    closest_elo = min(puzzles, key=lambda x:abs(x['elo']-elo))
    puzzle = PuzzleService(closest_elo['puzzle_id']).find_puzzle()
    if(puzzle):
        return json_response(puzzle)
    else:
        return json_response({'error': 'no puzzles found'}, 404)

@app.route("/puzzle/<int:id>", methods = ["GET", "POST", "PUT", "DELETE"])
def puzzle_functions(puzzle_id):
    if flask.request.method == 'GET':
        puzzle = PuzzleService(g.puzzle_id).find_puzzle()

        if(puzzle):
            return json_response(puzzle)
        else:
            return json_response({'error': 'no puzzles found'}, 404)

    elif flask.request.method == 'POST':
        puzzle_req = PuzzleSchema().load(json.loads(request.data))

        if puzzle_req.errors:
            return json_response({'error': puzzle_req.errors}, 422)
            
        puzzle = PuzzleService().create_puzzle(puzzle_req)
        return json_response(puzzle)

    elif flask.request.method == 'PUT':
        puzzle_req = PuzzleSchema().load(json.loads(request.data))

        if puzzle_req.errors:
            return json_response({'error': puzzle_req.errorss})
        
        puzzle_service=PuzzleService(g.puzzle_id)
        if puzzle_service.update_puzzle(elo, puzzle_req):
            return json_response(puzzle_service.data)
        else: 
            return json_response({'error': 'puzzle not found'}, 404)

    else:
        puzzle_service = PuzzleService(g.puzzle_id)
        if puzzle_service.delete_puzzle():
            return json_response({})
        else:
            return json_response({'error': 'puzzle not found'}, 404)


# Requires: username:string
# Returns: user: app.idp.user
@app.route("/user/<string:username>", methods = ["GET", "POST"]) 
def user(username):
    if flask.request.method == 'GET':
        user = IdentityService(g.user).find_user(username)

        if(user):
            return json_response(user)
        else:
            return json_response({'error': 'user not found'}, 404)
    
    elif flask.request.method == 'POST':
        user_req = IdentitySchema().load(json.loads(request.data))

        if user_req.errors:
            return json_response({'error': user_req.errors}, 422)
            
        user = IdentityService().create_user(user_req)
        return json_response(user)

@app.route("/user/<string:username>/<int:elo>", methods = ["PUT"])
def update_elo(username, elo):
    user_req = PuzzleSchema().load(json.loads(request.data))
    
    if user_req.errors:
        return json_response({'error': user_req.errors})

    user_service = IdentityService(g.user)
    if user_service.update_user(elo, user_req):
        return json_response(user_service.data)
    else:
        return json_response({'error': 'user not found'}, 404)
    
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

# @app.route("/action/dragged_to_bench", methods = ["POST"])
# def process_move():
    
# @app.route("/action/enemies_selected", methods = ["POST"])
# @app.route("/action/dragged_to_board", methods = ["POST"])
# @app.route("/action/passed", methods = ["POST"])



# # return: list of users and elo (up to 50)
# @app.route("/leaderboards", methods = ["GET"])


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

def json_response(payload, status=200):
    return (json.dumps(payload), status, {'content-type': 'application/json'})