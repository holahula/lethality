import requests
import json
import itertools

class Service(object):

    def command(self, game, action, action_to_take):
        if action_to_take == "attack_phase":
            self.attack_phase(game, action)
        elif action_to_take == "choose_attacker":
            self.choose_attacker(game, action)
        elif action_to_take == "play_minion":
            self.play_minion(game, action)
        elif action_to_take == 'play_spell':
            self.play_spell(game, action)
        elif action_to_take == 'unselect_attacker':
            self.unselect_attacker(game, action)

    def check_mana(self, game, action):
        # Checks if you have the mana to play the card, returns boolean
        card_info = self.find_id(game, action)
        # Find total cost of card
        card_mana = card_info["cost_delta"] + card_info['cost']
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
        # Create a board with all possible defenders' health and board with all possible attacker's attack
        fake_board = []
        attack_board = []
        current_damage = 0
        attack_board_count = 0
        # List of the damage taken from all possibilities of defending
        all_possible_damage = []
        # Fill attack_board with attacking minions
        for card in game['p_board']:
            index = game['p_board'].index(card)
            # Checking if challenger cards already have a standoff
            if game['o_board'][index] is None:
                attack_board.append(card)
        # Fill fake_board with bench cards, then fill the rest with None
        for card in game['o_bench']:
            # If can block, add card to defending lineup
            if "Can't Block" not in card['keywords']:
                fake_board.append(card)
        while len(attack_board) > len(fake_board):
            fake_board.append(None)
        # Find all permutations of defending
        perms = list(itertools.permutations(fake_board, len(attack_board)))
        # Do a quick combat simulation of each single permutation to find overall damage
        for combinations in perms:
            # Go through each and every single standoff
            for defender in combinations:
                index = combinations.index(defender)
                attacker = attack_board[index]
                damage = attacker['attack'] + attacker['attack_delta']
                # This means there's no defenders, so attacker hits face
                if defender == None:
                    current_damage += damage
                else:
                    defender_attack = defender['attack'] + defender['attack_delta']
                    # We invalidate the scenarios where the defense wouldn't work because of attacker keywords
                    # Really Scuffed, but if attacker is elusive and defender is not elusive, add alot to current damage
                    if 'Elusive' in attacker['keywords'] and 'Elusive' not in defender['keywords']:
                        current_damage = float('Inf')
                    # Also super scuffed, but if attacker is fearsome and defender has less than 3 attack, add alot to current damage
                    elif 'Fearsome' in attacker['keywords'] and defender_attack < 3:
                        current_damage = float('Inf')
                    # This means minion has overwhelming, apply overwhelming calculations
                    elif 'Overwhelm' in attacker['keywords']:
                        defender_hp = defender['health'] + defender['health_delta']
                        current_damage += (max(damage-defender_hp, 0))
            # Store the current_damage to the all_possible_damage list
            all_possible_damage.append(current_damage)
            # Reset current damage
            current_damage = 0
        # Find index of lowest possible damage
        lowest_damage_index = all_possible_damage.index(min(all_possible_damage))
        # Grabs list of best defense, and places them accordingly on the board
        best_defense = perms[lowest_damage_index]
        for card in attack_board:
            index = game['p_board'].index(card)
            game['o_board'][index] = best_defense[attack_board_count]
            attack_board_count += 1

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
    #     'o_spell_mana': 3,
    #     'attack_token': True,
    #     'action_button_text': 'PASS',
    #     'p_bench': [],
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
            # Subtract mana from total cost of minion
            game["p_mana"] -= (card_data["cost_delta"] + card_data["cost"])
            game["p_bench"].append(card_data)
            game['hand'].remove(card_data)

    def play_spell(self, game, action):
        # puts spell onto spell stack
        if self.check_mana(game, action):
            card_data = self.find_id(game, action)
            # Subtract spell mana from delta cost
            card_data["cost_delta"] -= game["p_spell_mana"]
            game["p_spell_mana"] = 0
            # Subtract mana from total cost of spell
            game["p_mana"] -= (card_data["cost_delta"] + card_data['cost'])
            game["spell_stack"].append(card_data)
            game["hand"].remove(card_data)
    
    def adjust_opponent_board(self, game, action):
        while len(game['p_board']) > len(game['o_board']):
            game['o_board'].append(None)
        while len(game['p_board']) < len(game['o_board']):
            game['o_board'].remove(None)

    def choose_attacker(self, game, action):
        # puts minion from bench to field
        if game['attack_token']:
            for card in game['p_bench']:
                if card['uuid'] == action['uuid']:
                    game['p_board'].append(card)
                    # Check if card has challenger
                    if "Challenger" in self.get_keywords(game, action) and action["targets"] != []:
                        self.challenger(game, action)
                    game['p_bench'].remove(card)
                    # Adds an empty cell in the enemy board
                    self.adjust_opponent_board(game, action)

    def unselect_attacker(self, game, action):
        # puts minion from field to bench
        self.adjust_opponent_board(game, action)
        for card in game['p_board']:
            if card['uuid'] == action['uuid']:
                # Remove the opposing cell in the enemy board
                opposing_index = game['p_board'].index(card)
                game['o_board'].pop(opposing_index)
                # Transfer action card from board to bench
                game['p_board'].remove(card)
                game['p_bench'].append(card)
        self.adjust_opponent_board(game, action)
 
    def find_opposing_card(self, game, action):
        # Finds opposing card during battle phase
        area = action['area']
        for card in game[area]:
            if card['uuid'] == action['uuid']:
                index = game[area].index(card)
                if area == 'p_board':
                    return game['o_board'][index]
                else:
                    return game['p_board'][index]

    def attack_phase(self, game, action):
        # AI blocks
        self.adjust_opponent_board(game, action)
        self.block_AI(game, action)
        # Goes through every single attacking minion
        for card in game['p_board']:
            index = game['p_board'].index(card)
            # Updates action for each individual minion
            action_data = {'uuid': card['uuid'], 'targets': [], 'area': 'p_board'}
            # Attack face if no defending minion
            opposing_field = game['o_board'][index]
            if game['o_board'][index] is None:
                self.direct_hit(game, action_data)
            else:
                if "Barrier" in card['keywords']:
                    self.barrier(game, action_data)
                elif 'Tough' in card['keywords'] and (opposing_field['attack']+opposing_field['attack_delta'] > 0):
                    self.tough(game, action_data)
                if 'Life Steal' in card['keywords']:
                    self.life_steal(game, action_data)
                if 'Quick Attack'in card['keywords']:
                    self.quick_attack(game, action_data)
                else:
                    self.standoff(game, action_data)
            self.unselect_attacker(game, action_data)  

        game['attack_token'] = False

    def pass_turn(self, game, action):
        pass

    def standoff(self, game, action):
        # When an attacking minion faces an enemy minion
        opposing_card = self.find_opposing_card(game, action)
        card = self.find_id(game, action)
        attacker_dmg = card['attack'] + card['attack_delta']
        opposing_dmg = opposing_card['attack'] + opposing_card['attack_delta']
        card['health_delta'] -= opposing_dmg
        opposing_card['health_delta'] -= attacker_dmg

    def direct_hit(self, game, action):
        # When an attacking minion attacks nexus
        card = self.find_id(game, action)
        # Find total damage of attacker
        dmg = card['attack'] + card['attack_delta']
        game['o_health'] -= dmg

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
                game['o_health'] -= max(0, (card['attack'] + card['attack_delta']) - (opposing_card['health'] + opposing_card['health_delta']))

    def barrier(self, game, action):
        # Negate the first damage done to it
        opposing_card = self.find_opposing_card(game, action)
        opposing_dmg = opposing_card['attack'] + opposing_card['attack_delta']
        card = self.find_id(game, action)
        card['health_delta'] += opposing_dmg
        pass

    def elusive(self, game, action):
        pass

    def drain(self, game, action):
        pass

    def quick_attack(self, game, action):
        # works only on player side, attacks other card first before getting hit
        for card in game['p_board']:
            if card['uuid'] == action['uuid']:
                # Finds opposing card of quick attacker
                opposing_card = self.find_opposing_card(game, action)
                # Find total damage of quick attacker and apply to delta of defender
                opposing_card['health_delta'] -= (card['attack_delta'] + card['attack'])
                # If opposing card doesnt die, it attacks
                if (opposing_card['health_delta'] + opposing_card['health']) > 0:
                    # Find total damage of defender and apply to quick attacker
                    card['health_delta'] -= (opposing_card['attack_delta'] + opposing_card['attack'])

    def tough(self, game, action):
        # Take one less damage from all sources
        for card in game[action['area']]:
            if card['uuid'] == action['uuid']:
                card['health_delta'] += 1

    def regeneration(self, game, action):
        pass

    def life_steal(self, game, action):
        # Searches for card in either p_bench or o_bench
        area = action['area']
        for card in game[area]:
            if card['uuid'] == action['uuid']:
                attack_delta = card['attack_delta']
                attack = card['attack']
                # Heal for how much attack delta on the lifesteal card is
                if area == 'o_board':
                    game['o_health'] = min(20, game['o_health'] + attack_delta + attack)
                else:
                    game['p_health'] = min(20, game['p_health'] + attack_delta + attack)

    def challenger(self, game, action):
        # Find the card I'm challenging, find the index of the challenger
        target = action["targets"][0]
        for card in game["o_bench"]:
            # Move opponent card from bench to board
            if card["uuid"] == target["uuid"]:
                index = game["p_bench"].index(card)
                game["o_board"][index] = card
                game['o_bench'].remove(card)

    def fearsome(self, game, action):
        pass

    def cant_block(self, game, action):
        pass

