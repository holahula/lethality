from marshmallow import Schema, fields

class Puzzle(Schema):
    id = fields.Int(required=True)
    description = fields.Str()
    board = fields.Str()

class Board(Schema):
    id = fields.Int(required=True)

class Rectangle(Schema):
    