import requests
import json

class Service(object):

    def get_card_data(self, cardCode):
        # Gets card data, converts to json
        r = requests.get(f"https://storage.googleapis.com/lethality/card_data/{cardCode}.json")
        obj = json.loads(r.text)
        return obj

    def check_mana(self, game, action):
        # Checks if you have the mana to play the card, returns boolean
        card_info = self.find_id(game, action)
        card_mana = card_info["cost_delta"]
        available_mana = game["p_mana"]
        if card_info["spellSpeed"] != "":
            available_mana += game["p_spell_mana"]
        if card_mana <= available_mana:
            return True
        else:
            return False

    def find_id(self, game, action):
        # Finds the id of the card given the uuid and area, returns cardCode
        uuid = action["uuid"]
        area = action["area"]
        for card in game[area]:
            if card["uuid"] == uuid:
                return card
    
    def get_keywords(self, game, action):
        card_info = self.find_id(game, action)
        return card_info["keywords"]
    
    def block_AI(self, game, action):
        pass

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
    #         {'uuid': '12345', 'cardCode': 'RITO'}
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
            card_data = self.find_id(game, action)
            game["p_mana"] -= card_data["cost_delta"]
            game["p_bench"].append(card_data)
            game['hand'].remove(card_data)

    def play_spell(self, game, action):
        # puts spell onto spell stack
        if self.check_mana(game, action):
            card_data = self.find_id(game, action)
            card_data["cost_delta"] -= game["p_spell_mana"]
            game["p_spell_mana"] = 0
            game["p_mana"] -= card_data["cost_delta"]
            game["spell_stack"].append(card_data)
            game["hand"].remove(card_data)
                    

    def choose_attacker(self, game, action):
        # puts minion from bench to field
        if game['attack token']:
            for card in game['p_bench']:
                if card['uuid'] == action['uuid']:
                    game['p_board'].append(card)
                    game['p_bench'].remove(card)
                    # Adds an empty cell in the enemy board
                    game['o_board'].append(None)
                    # Check if card has challenger
                    if "Challenger" in self.get_keywords(game, action) and action["targets"] != []:
                        self.challenger(game, action)
    
    def unselect_attacker(self, game, action):
        # puts minion from field to bench
        for card in game['p_board']:
            if card['uuid'] == action['uuid']:
                # Remove the opposing cell in the enemy board
                opposing_index = game['p_board'].index(card)
                game['o_board'].pop(opposing_index)
                # Transfer action card from board to bench
                game['p_board'].remove(card)
                game['p_bench'].append(card)
    
    def find_opposing_card(self, game, action):
        # Finds opposing card during battle phase
        area = action['area']
        for card in game[area]:
            if game['uuid'] == action['uuid']:
                index = game[area].index(card)
                if area == 'p_board':
                    return game['o_board'][index]
                else:
                    return game['p_board'][index]

    def attack_phase(self, game, action):
        # AI blocks highest attack minions
        # Spells get played first
        # Go through each matchup, check keywords for both sides of board and attack
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
        # Check if minion has quick attack first, then check everything else
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
        for card in game['p_board']:
            if card['uuid'] == action['uuid']:
                # Finds opposing card of overwhelmer
                opposing_card = self.find_opposing_card(game, action)
                # Apply overwhelm keyword effect
                game['o_health'] -= max(0, card['delta_attack'] - opposing_card['delta_health'])

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
        # works only on player side, attacks other card first before getting hit
        for card in game['p_board']:
            if card['uuid'] == action['uuid']:
                # Finds opposing card of quick attacker
                opposing_card = self.find_opposing_card(game, action)
                opposing_card['health_delta'] -= card['attack_delta']
                # If opposing card doesnt die, it attacks
                if opposing_card['health_delta'] > 0:
                    card['health_delta'] -= opposing_card['attack_delta']

    def tough(self, game, action):
        pass

    def recall(self, game, action):
        pass

    def regeneration(self, game, action):
        pass

    def life_steal(self, game, action):
        # Searches for card in either p_bench or o_bench
        area = action['area']
        for card in game[area]:
            if card['uuid'] == action['uuid']:
                attack_delta = card['attack_delta']
                # Heal for how much attack delta on the lifesteal card is
                if area == 'o_board':
                    game['o_health'] = max(20, game['o_health'] + attack_delta)
                else:
                    game['p_health'] = max(20, game['p_health'] + attack_delta)


    def enlightened(self, game, action):
        pass

    def ephemeral(self, game, action):
        pass

    def challenger(self, game, action):
        # Find the card I'm challenging, find the index of the challenger
        target = action["targets"][0]
        for card in game["o_bench"]:
            # Move opponent card from bench to board
            if card["uuid"] == target["uuid"]:
                index = game["p_bench"].index(card)
                game["o_board"][index] = card
                game['o_bench'].remove(card)


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
