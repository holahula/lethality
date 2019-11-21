from ..repository import Repository
from ..repository.mongo_user import MongoUserRepository
from .schema import IdentitySchema

class Service:
    def __init__(self, repo_client=Repository(adapter=MongoUserRepository)):
        self.repo_client = repo_client

    def find_all_users(self):
        users = self.repo_client.find_all()

    def find_user(self, user_id):
        user = self.repo_client.find({'user_id': user_id})
        return self.dump(user)
#fix
    def create_user(self):
        self.repo_client.create(self.prepare_user("1500"))
        return self.dump(elo)

    def update_user(self, elo):
        records_affected = self.repo.update({'user_id': user_id}, self.prepare_user(user_id, elo))
        return records_affected > 0

    def delete_user(self):
        records_affected = self.repo_client.delete({'user_id': user_id})
        return records_affected > 0

    def dump(self, data):
        return UserSchema().dump(data).data
    
    def prepare_user(self, user_id, elo):
        data['user'] = user_id
        data['elo'] = elo
        return user
    
