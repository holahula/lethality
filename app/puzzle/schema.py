from marshmallow import Schema, fields

class CardSchema(Schema):
    card_id = fields.Str()
    uuid = fields.Str()

class GameStateSchema(Schema):
    p_health = fields.Int()
    o_health = fields.Int()
    p_mana = fields.Int()
    o_mana = fields.Int()
    p_spell_mana = fields.Int()
    o_spell_mana = fields.Int()

    attack_token = fields.Boolean()

    action_button_text = fields.Str()

    hand = fields.Nested(CardSchema())

    p_bench = fields.Nested(CardSchema())
    o_bench = fields.Nested(CardSchema())
    p_board = fields.Nested(CardSchema())
    o_board = fields.Nested(CardSchema())

    spell_stack = fields.Nested(CardSchema())

class PuzzleSchema(GameStateSchema):
    puzzle_id = fields.Int(required=True)
    elo = fields.Int()
