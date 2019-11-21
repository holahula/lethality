from marshmallow import Schema, fields

class IdentitySchema(Schema):
    username = fields.Str(required=True)
    elo = fields.Integer()

