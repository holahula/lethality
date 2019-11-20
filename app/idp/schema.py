from marshmallow import Schema, fields

class IdentitySchema(Schema):
    username = fields.Str(required=true)
    elo = fields.Integer()

