
class HeroAbility:

    def __init__(self):
        self.hero = ''
        self.name = ''
        self.description = ''
        self.notes = ''
        self.lore = ''
        self.basic_damage = ''
        self.mana_cost = ''
        self.cooldown = ''

    def get_name(self):
        return self.name

    def get_hero(self):
        return self.hero

    def get_description(self):
        return self.description

    def get_notes(self):
        return self.notes

    def get_lore(self):
        return self.lore

    def get_basic_damage(self):
        return self.basic_damage

    def get_mana_cost(self):
        return self.mana_cost

    def get_cooldown(self):
        return self.cooldown

    def set_name(self, name):
        self.name = name

    def set_hero(self, hero):
        self.hero = hero

    def set_description(self, description):
        self.description = description

    def set_notes(self, notes):
        self.notes = notes

    def set_lore(self, lore):
        self.lore = lore

    def set_basic_damage(self, basic_damage):
        self.basic_damage = basic_damage

    def set_mana_cost(self, mana_cost):
        self.mana_cost = mana_cost

    def set_cooldown(self, cooldown):
        self.cooldown = cooldown
