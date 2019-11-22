import os
from pymongo import MongoClient

COLLECTION_NAME = 'PUZZLES'

class MongoPuzzleRepository(object):
    def __init__(self):
        mongo_url = os.environ.get('MONGO_URL')
        self.db = MongoClient(mongo_url).puzzles
    
    def find_all(self, selector):
        return self.db.puzzles.find(selector)
    
    def find(self, selector):
        return self.db.puzzles.find_one(selector)

    def create(self, puzzle):
        return self.db.puzzles.insert_one(puzzle)
    
    def update(self, selector, puzzle):
        return self.db.puzzles.replace_one(selector, puzzle).modified_count

    def delete(self, selector):
        return self.db.puzzles.delete_one(selector).deleted_count