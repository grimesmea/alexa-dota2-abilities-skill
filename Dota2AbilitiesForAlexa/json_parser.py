import json
import os
from Dota2AbilitiesForAlexa.ability_parser import AbilityParser
from Dota2AbilitiesForAlexa.dota2_skill_builder import Dota2SkillBuilder


class JsonParser:

    ability_parser = AbilityParser()

    def __init__(self):
        self.abilities_json = {}
        self.abilities_dict = {}

        self.hero_names = []
        self.ability_names = []

        self.hero_abilities_dict = {}
        self.ability_details_dict = {}

        self.ability_description_dict = {}
        self.ability_notes_dict = {}
        self.ability_lore_dict = {}
        self.ability_cooldown_dict = {}

        self.load_abilities_json()
        self.parse_heroes_and_abilities()
        # self.write_files_for_skill_logic()
        # self.write_files_for_slot()

    def load_abilities_json(self):
        script_dir = os.path.dirname(__file__)
        file_path = os.path.join(script_dir, 'abilities.json')
        with open(file_path) as data_file:
            self.abilities_json = json.load(data_file)
        self.abilities_dict = self.abilities_json.get('abilitydata')

    def parse_heroes_and_abilities(self):
        for ability, info in self.abilities_dict.items():
            self.add_ability_to_dicts(info)

    def add_ability_to_dicts(self, ability_info):
        hero_ability = self.ability_parser.parse_ability_info(ability_info)

        if hero_ability.get_hero() not in self.hero_names:
            self.hero_names.append(hero_ability.get_hero())
            self.hero_names.append(hero_ability.get_hero() + '\'s')

        if hero_ability.get_name() not in self.ability_names:
            self.ability_names.append(hero_ability.get_name())
            self.ability_names.append(hero_ability.get_name() + '\'s')

        self.hero_abilities_dict.setdefault(hero_ability.get_hero(), []).append(hero_ability.get_name())

        self.ability_description_dict.setdefault(hero_ability.get_name(), []).append(hero_ability.get_description())
        self.ability_lore_dict.setdefault(hero_ability.get_name(), []).append(hero_ability.get_lore())
        self.ability_notes_dict.setdefault(hero_ability.get_name(), []).append(hero_ability.get_notes())
        self.ability_cooldown_dict.setdefault(hero_ability.get_name(), []).append(hero_ability.get_cooldown())

        ability_details_values = {}
        ability_details_values['hero'] = hero_ability.get_hero()
        ability_details_values['description'] = hero_ability.get_description()
        ability_details_values['lore'] = hero_ability.get_lore()
        ability_details_values['notes'] = hero_ability.get_notes()
        ability_details_values['cooldown'] = hero_ability.get_cooldown()

        self.ability_details_dict[hero_ability.get_name()] = ability_details_values


    def get_hero_abilities(self):
        return self.hero_abilities_dict

    def get_ability_details(self):
        return self.ability_details_dict
