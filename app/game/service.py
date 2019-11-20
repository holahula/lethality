class Service(object):

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

    def take_action(self, game, action):
        # filter what the action actually is so that we have context
        # call related helper function to do more work

        # context we want to look for:
        # 1. the phase of the game
        # 2. types of cards involved in action (spell, summon, attack, etc.)
        pass

    # once a gerenal type is associated with the action, we can break it down even further
    # helper functions will split into other helper functions, etc.

    def play_minion(self, game, action):
        # puts minion onto bench array
        pass

    def play_spell(self, game, action):
        pass

    def choose_attacker(self, game, action):
        pass

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

    def last_breath(self, game, action):
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