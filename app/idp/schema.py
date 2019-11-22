from marshmallow import Schema, fields

class IdentitySchema(Schema):
    user_id = fields.Str(required=True)
    elo = fields.Integer()

