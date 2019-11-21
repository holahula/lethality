from ..repository import Repository
from ..repository.mongo_puzzle import MongoPuzzleRepository
from .schema import PuzzleSchema

class Service:
    def __init__(self, repo_client=Repository(adapter=MongoPuzzleRepository)):
        self.repo_client = repo_client
        
    def find_all_puzzles(self):
        puzzles = self.repo_client.find_all()
        return [self.dump(puzzle) for puzzle in puzzles]

    def find_puzzle(self, puzzle_id):
        puzzle = self.repo_client.find({'puzzle_id': puzzle_id})
        return self.dump(puzzle)
    
    def create_puzzle(self, game_state):
        self.repo_client.create(self.prepare_puzzle(game_state))
        return self.dump(game_state.data)

    def update_puzzle(self, elo, game_state):
        records_affected = self.repo.update({'puzzle_id': self.puzzle_id}, self.prepare_puzzle(game_state))
        return records_affected > 0

    def delete_puzzle(self):
        records_affected = self.repo_client.delete({'puzzle_id': self.puzzle_id})
        return records_affected > 0
    
    def dump(self, data):
        return PuzzleSchema(exclude=['_puzzle_id']).dump(data).data

    def prepare_puzzle(self, game_state):
        data = game_state.data
        data['puzzle_id'] = self.puzzle_id
        data['elo'] = self.elo
        return puzzle_id


    