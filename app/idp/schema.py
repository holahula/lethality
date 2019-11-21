from marshmallow import Schema, fields

class IdentitySchema(Schema):
    user = fields.Str(required=True)
    elo = fields.Integer()

