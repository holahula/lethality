from marshmallow import Schema, fields

class AssetSchema(Schema):
    gameAbsolutePath = fields.Str()
    fullAbsolutePath = fields.Str()

class CardSchema(Schema):
    cardCode = fields.Str()
    uuid = fields.Str()
    health_delta = fields.Int()
    cost_delta = fields.Int()
    attack_delta = fields.Int()

    associatedCards = fields.List(fields.Str())
    associatedCardRefs = fields.List(fields.Str())
    assets = fields.List(fields.Nested(AssetSchema()))
    region = fields.Str()
    regionRef = fields.Str()
    attack = fields.Int()
    cost = fields.Int()
    health = fields.Int()
    description = fields.Str()
    descriptionRaw = fields.Str()
    levelupDescription = fields.Str()
    levelupDescriptionRaw = fields.Str()
    flavorText = fields.Str()
    artistName = fields.Str()
    name = fields.Str()
    keywords = fields.List(fields.Str())
    keywordRefs = fields.List(fields.Str())
    spellSpeed =fields.Str()
    spellSpeedRef = fields.Str()
    rarity = fields.Str()
    rarityRef = fields.Str()
    subtype =fields.Str()
    supertype = fields.Str()
    type = fields.Str()
    collectible = fields.Boolean()

class GameStateSchema(Schema):
    p_health = fields.Int()
    o_health = fields.Int()
    p_mana = fields.Int()
    o_mana = fields.Int()
    p_spell_mana = fields.Int()
    o_spell_mana = fields.Int()

    attack_token = fields.Boolean()

    action_button_text = fields.Str()

    hand = fields.List(fields.Nested(CardSchema()))
    p_bench = fields.List(fields.Nested(CardSchema()))
    o_bench = fields.List(fields.Nested(CardSchema()))
    p_board = fields.List(fields.Nested(CardSchema()))
    o_board = fields.List(fields.Nested(CardSchema()))

    spell_stack = fields.List(fields.Nested(CardSchema()))

class PuzzleSchema(GameStateSchema):
    puzzle_id = fields.Str(required=True)
    elo = fields.Int()
