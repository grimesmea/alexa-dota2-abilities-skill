import re
from Dota2AbilitiesForAlexa.hero_ability import HeroAbility


class AbilityParser:

    def __init__(self):
        pass

    def parse_ability_info(self, ability_json):
        hero_ability = HeroAbility()

        hero_ability.set_name(ability_json.get('dname').lower().replace('_', ' '))
        hero_ability.set_hero(ability_json.get('hurl').lower().replace('_', ' '))
        hero_ability.set_description(self.remove_html(ability_json.get('desc')))
        hero_ability.set_notes(self.remove_html(ability_json.get('notes')))
        hero_ability.set_lore(self.remove_html(ability_json.get('lore')))
        (mana_cost, cooldown) = self.parse_mana_cost_cooldown(ability_json.get('cmb'))
        hero_ability.set_mana_cost(mana_cost)
        hero_ability.set_cooldown(cooldown)

        return hero_ability

    # def parse_basic_damage(self, ability_damage):
    #     ability_damage = self.remove_html(ability_damage).strip().split("  ")
    #     damage = ''
    #     if ability_damage is None:
    #         return damage
    #     ability_damage = self.remove_html(ability_damage).strip().split("  ")
    #     for i in range(len(ability_damage) - 1):
    #         if ability_damage[i] == 'DAMAGE:':
    #             basic_damage = ability_damage[i + 1]
    #     return damage

    def parse_mana_cost_cooldown(self, cmb):
        mana_cost = ''
        cooldown = ''
        if cmb is None:
            return (mana_cost, cooldown)
        if "Mana Cost" not in cmb:
            cmb = self.remove_html(cmb).strip().split("  ")
            cooldown = re.sub(r'\[|\]', '', str(cmb))
        elif "Cooldown" not in cmb:
            cmb = self.remove_html(cmb).strip().split("  ")
            mana_cost = re.sub(r'\[|\]', '', str(cmb))
        else:
            cmb = self.remove_html(cmb).strip().split("  ")
            cmb = list(filter(None, cmb))
            cooldown = re.sub(r'\[|\]', '', str(cmb.pop()))
            mana_cost = re.sub(r'\[|\]', '', str(cmb.pop()))
        return (mana_cost, cooldown)

    def remove_html(self, ability_info):
        processed_string = ''
        opening_brackets = []
        for i in range(len(ability_info)):
            if ability_info[i] == '<':
                opening_brackets.append(i)
            elif ability_info[i] == '>':
                opening_brackets.pop()
                processed_string += " "
            elif len(opening_brackets) == 0:
                processed_string += ability_info[i]

        processed_string = processed_string.replace('\r\n\r\n', '')
        processed_string = processed_string.replace('\<br />', '')
        processed_string = processed_string.replace('\r', '')
        return processed_string.replace('\n', '')
