from flask import Flask, json, g, request
from app.idp.service import Service as IdentityService
from app.idp.schema import IdentitySchema

from app.puzzle.service import Service as PuzzleService
from app.puzzle.schema import PuzzleSchema

from app.game.service import Service as Game

from flask_cors import CORS

from marshmallow import ValidationError

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

def get_card_data(card_id):
    # Gets card data, converts to json
    r = requests.get(f"https://storage.googleapis.com/lethality/card_data/{cardCode}.json")
    obj = json.loads(r.text)
    return obj

def fill_puzzle_data(puzzle):
    for area_name in ['hand', 'p_bench', 'o_bench', 'p_board', 'o_board']:
        area = getattr(puzzle, area_name)
        for i in range(len(area)):
            card = area[i]
            if card is not None:
                card_data = get_card_data(card.card_id)
                card_data['uuid'] = card.card_id
                card_data['attack_delta'] = 0
                card_data['cost_delta'] = 0
                card_data['health_delta'] = 0
                area[i] = card_data

# https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react

@app.route("/", methods = ["GET"])
def entry():
    return json_response({"yes": "no"}, 200)

# Returns the next puzzle based on elo
@app.route("/puzzles/<int:elo>", methods = ["GET"])
def next_puzzle(elo):
    puzzles = PuzzleService().find_all_puzzles()

    if len(puzzles) == 0:
        return json_response({"error": "no puzzles found in initial query"}, 404)

    closest_elo = min(puzzles, key=lambda x:abs(x["elo"]-elo))
    puzzle = PuzzleService().find_puzzle(closest_elo["puzzle_id"])
    if puzzle:
        fill_puzzle_data(puzzle)
        return json_response(puzzle)
    else:
        return json_response({"error": "no puzzles found (closest elo)"}, 404)

@app.route("/puzzle/<int:puzzle_id>", methods = ["GET", "DELETE"])
def puzzle(puzzle_id):
    puzzle_service = PuzzleService()

    if request.method == "GET":
        puzzle = puzzle_service.find_puzzle(puzzle_id)

        if puzzle:
            fill_puzzle_data(puzzle)
            return json_response(puzzle)
        else:
            return json_response({"error": "no puzzles found"}, 404)

    elif request.method == "DELETE":
        if puzzle_service.delete_puzzle(puzzle_id):
            return json_response({"success": "puzzle deleted"}, 200)
        else:
            return json_response({"error": "puzzle not found"}, 404)

@app.route("/puzzle", methods = ["POST", "PUT"])
def puzzle_functions():
    try:
        print(json.loads(request.data))
        puzzle_req = PuzzleSchema().load(json.loads(request.data))
    except ValidationError as error:
        return json_response({"error": error})

    puzzle_service = PuzzleService()

    if request.method == "POST":
        puzzle = PuzzleService().create_puzzle(puzzle_req)
        return json_response({"success": "puzzle created - " + str(puzzle_req["puzzle_id"])}, 200)

    elif request.method == "PUT":
        if puzzle_service.update_puzzle(puzzle_req):
            return json_response({"success": "puzzle updated"}, 200)
        else:
            return json_response({"error": "puzzle not found"}, 404)

# Requires: user_id:string
# Returns: user: app.idp.user
@app.route("/user/<string:user_id>", methods = ["GET", "DELETE"])
def user(user_id):
    identity_service = IdentityService()

    if request.method == "GET":
        user = identity_service.find_user(user_id)
        if user:
            return json_response(user)
        else:
            return json_response({"error": "user not found"}, 404)

    elif request.method == "DELETE":
        if identity_service.delete_user(user_id):
            return json_response({"success": "user deleted"}, 200)
        else:
            return json_response({"error": "user not found"}, 404)

@app.route("/user", methods = ["POST", "PUT"])
def user_functions():
    try:
        user_req = IdentitySchema().load(json.loads(request.data))
    except ValidationError as error:
        return json_response({"error": error})

    identity_service = IdentityService()

    if request.method == "POST":
        user = identity_service.create_user(user_req)
        return json_response({"success": "user created - " + user_req["user_id"]}, 200)

    elif request.method == "PUT":
        if identity_service.update_user(user_req):
            return json_response({"success": "user updated"}, 200)
        else:
            return json_response({"error": "user not found"}, 404)

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
#     \ |  .-""#%&#&%#``-.
#    = /  ((%&#&#&%&VK&%&))
#     |    `-._#%&##&%_.-"
#  /\/\`--.   `-."".-"
#  |  |    \   /`./
#  |\/|  \  `-"  /
#  || |   \     /            VK

def json_response(payload, status=200):
    return (json.dumps(payload), status, {"content-type": "application/json"})
