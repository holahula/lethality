import requests
import json

class Service(object):

    def get_card_data(self, card_id):
        # Gets card data, converts to json
        r = requests.get(f"https://storage.googleapis.com/lethality/card_data/{card_id}.json")
        obj = json.loads(r.text)
        return obj

    def check_mana(self, game, action):
        # Checks if you have the mana to play the card, returns boolean
        card_id = self.find_id(game, action)
        card_info = self.get_card_data(card_id)
        card_mana = card_info["cost"]
        available_mana = game["p_mana"]
        if card_info["spellSpeed"] is not "":
            available_mana += game["p_spell_mana"]
        if card_mana <= available_mana:
            return True
        else:
            return False

    def find_id(self, game, action):
        # Finds the id of the card given the uuid and area, returns card_id
        uuid = action["uuid"]
        area = action["area"]
        for card in game[area]:
            if card["uuid"] == uuid:
                return card["card_id"]

    # 1-to-1 matching with easy endpoints for mogen
    # dragged_to_bench
    # dragged_to_board
    # action_button_pressed
    # etc.
    # things that represent the physical movements and interactions the player just made with a card

    # example game and action which may be given for `dragged_to_board`

    # game:
    # {
    #     'p_health': 20,
    #     'o_health': 20,
    #     'p_mana': 10,
    #     'o_mana': 10,
    #     'p_spell_mana': 3,
    #     'o_speel_mana': 3,
    #     'attack_token': True,
    #     'action_button_text': 'PASS',
    #     'p_bench': [
    #         {'uuid': '12345', 'card_id': 'RITO'}
    #     ],
    #     'o_bench': [],
    #     'p_board': [],
    #     'o_board': [],
    #     'hand': [],
    #     'spell_stack': []
    # }

    # action:
    # {
    #     'uuid': '12345',
    #     'targets': [],
    #     'area': 'p_bench'
    # }

    def play_minion(self, game, action):
        # puts minion onto bench array
        if self.check_mana(game, action):
            for card in game["hand"]:
                if card["uuid"] == action["uuid"]:
                    # Get the wanted card_data, use up its mana and move it to the bench
                    card_data = self.get_card_data(card["card_id"])
                    game["p_mana"] -= card_data["cost"]
                    game["p_bench"].append(card)
                    game['hand'].remove(card)

    def play_spell(self, game, action):
        # puts spell onto spell stack
        if self.check_mana(game, action):
            for card in game["hand"]:
                if card["uuid"] == action["uuid"]:
                    # Remove spell mana first, then use normal mana, remove card from hand and put to spell stack
                    card_data = self.get_card_data(card["card_id"])
                    card_data["cost"] -= game["p_spell_mana"]
                    game["p_spell_mana"] = 0
                    game["p_mana"] -= card_data["cost"]
                    game["spell_stack"].append(card)
                    game["hand"].remove(card)

    def choose_attacker(self, game, action):
        # puts minion from bench to field
        if game['attack token']:
            for card in game['p_bench']:
                if card['uuid'] == action['uuid']:
                    game['p_board'].append(card)
                    game['p_bench'].remove(card)

    def attack_phase(self, game, action):
        pass

    def pass_turn(self, game, action):
        pass

    def burst_spell(self, game, action):
        pass

    def slow_spell(self, game, action):
        pass

    def fast_spell(self, game, action):
        pass

    def play_champion(self, game, action):
        pass

    def standoff(self, game, action):
        # When an attacking minion faces an enemy minion
        pass

    def direct_hit(self, game, action):
        # When an attacking minion attacks nexus
        pass

    def battlecry(self, game, action):
        pass

    def last_breath(self, game, action):
        pass

    def stun(self, game, action):
        pass

    def frozen(self, game, action):
        pass

    def overwhelm(self, game, action):
        pass

    def barrier(self, game, action):
        pass

    def strike(self, game, action):
        pass

    def nexus_strike(self, game, action):
        pass

    def obliterate(self, game, action):
        pass

    def double_strike(self, game, action):
        pass

    def elusive(self, game, action):
        pass

    def drain(self, game, action):
        pass

    def trap(self, game, action):
        pass

    def discard(self, game, action):
        pass

    def capture(self, game, action):
        pass

    def frostbite(self, game, action):
        pass

    def fleeting(self, game, action):
        pass

    def quick_attack(self, game, action):
        pass

    def tough(self, game, action):
        pass

    def recall(self, game, action):
        pass

    def regeneration(self, game, action):
        pass

    def life_steal(self, game, action):
        pass

    def enlightened(self, game, action):
        pass

    def ephemeral(self, game, action):
        pass

    def challenger(self, game, action):
        pass

    def imbue(self, game, action):
        pass

    def fearsome(self, game, action):
        pass

    def cant_block(self, game, action):
        pass

    def support(self, game, action):
        pass

    def level_up(self, game, action):
        pass
