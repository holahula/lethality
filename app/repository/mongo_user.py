import os
from pymongo import MongoClient

COLLECTION_NAME = 'USERS'

class MongoUserRepository(object):
    def __init__(self):
        mongo_url = os.environ.get('MONGO_URL')
        self.db = MongoClient(mongo_url).users
    
    def find_all(self, selector):
        return self.db.users.find(selector)
    
    def find(self, selector):
        return self.db.users.find_one(selector)

    def create(self, puzzle):
        return self.db.users.insert_one(puzzle)
    
    def update(self, selector, puzzle):
        return self.db.users.replace_one(selector, user).modified_count

    def delete(self, selector):
        return self.db.users.delete_one(selector).deleted_count