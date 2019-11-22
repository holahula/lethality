from ..repository import Repository
from ..repository.mongo_puzzle import MongoPuzzleRepository
from .schema import PuzzleSchema

class Service:
    def __init__(self, repo_client=Repository(adapter=MongoPuzzleRepository)):
        self.repo_client = repo_client

    def find_all_puzzles(self):
        puzzles = self.repo_client.find_all({})
        return [self.dump(puzzle) for puzzle in puzzles]

    def find_puzzle(self, puzzle_id):
        puzzle = self.repo_client.find({"puzzle_id": puzzle_id})
        return self.dump(puzzle)
    
    def create_puzzle(self, puzzle_req):
        puzzle = self.repo_client.create(self.prepare_puzzle(puzzle_req))
        return self.dump(puzzle)

    def update_puzzle(self, puzzle_req):
        records_affected = self.repo_client.update({"puzzle_id": puzzle_req["puzzle_id"]}, self.prepare_puzzle(puzzle_req))
        return records_affected > 0

    def delete_puzzle(self, puzzle_id):
        records_affected = self.repo_client.delete({"puzzle_id": puzzle_id})
        return records_affected > 0
    
    def dump(self, data):
        return PuzzleSchema().dump(data)

    def prepare_puzzle(self, puzzle_req):
        data = puzzle_req
        data["puzzle_id"] = puzzle_req["puzzle_id"]
        data["elo"] = puzzle_req["elo"]
        return data


    