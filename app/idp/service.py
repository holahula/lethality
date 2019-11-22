from ..repository import Repository
from ..repository.mongo_user import MongoUserRepository
from .schema import IdentitySchema

class Service:
    def __init__(self, repo_client=Repository(adapter=MongoUserRepository)):
        self.repo_client = repo_client

    def find_all_users(self):
        users = self.repo_client.find_all({})
        return [self.dump(user) for user in users]

    def find_user(self, user_req):
        user = self.repo_client.find({'user_id': user_req["user_id"]})
        return self.dump(user)
#fix
    def create_user(self, user_req):
        user = self.repo_client.create(self.prepare_user(user_req))
        return self.dump(user)

    def update_user(self, user_req):
        records_affected = self.repo_client.update({"user_id": user_req["user_id"]}, self.prepare_user(user_req))
        return records_affected > 0

    def delete_user(self, user_req):
        records_affected = self.repo_client.delete({"user_id": user_req["user_id"]})
        return records_affected > 0

    def dump(self, data):
        return IdentitySchema().dump(data)
    
    def prepare_user(self, user_req):
        data = {}
        data["user_id"] = user_req["user_id"]
        data["elo"] = user_req["elo"]
        return data
    
