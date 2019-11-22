import requests
import json
import itertools

class Service(object):

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
                defender_attack = defender['attack'] + defender['attack_delta']
                # We invalidate the scenarios where the defense wouldn't work because of attacker keywords
                # Really Scuffed, but if attacker is elusive and defender is not elusive, add alot to current damage
                if 'Elusive' in attacker['keywords'] and 'Elusive' not in defender['keywords']:
                    current_damage += 1000000
                # Also super scuffed, but if attacker is fearsome and defender has less than 3 attack, add alot to current damage
                elif 'Fearsome' in attacker['keywords'] and defender_attack < 3:
                    current_damage += 1000000
                # This means there's no defenders, so attacker hits face
                elif defender == None:
                    current_damage += damage
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
        card = self.find_id(game, action)
        # Find total damage of attacker
        dmg = card['attack'] + card['attack_delta']
        game['o_health'] -= dmg

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
                game['o_health'] -= max(0, (card['attack'] + card['attack_delta']) - (opposing_card['health'] + opposing_card['health_delta']))

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
                # Find total damage of quick attacker and apply to delta of defender
                opposing_card['health_delta'] -= (card['attack_delta'] + card['attack'])
                # If opposing card doesnt die, it attacks
                if (opposing_card['health_delta'] + opposing_card['health']) > 0:
                    # Find total damage of defender and apply to quick attacker
                    card['health_delta'] -= (opposing_card['attack_delta'] + opposing_card['attack'])

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
                attack = card['attack']
                # Heal for how much attack delta on the lifesteal card is
                if area == 'o_board':
                    game['o_health'] = max(20, game['o_health'] + attack_delta + attack)
                else:
                    game['p_health'] = max(20, game['p_health'] + attack_delta + attack)


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
