import json
import os
import re


class Dota2SkillBuilder:

    def __init__(self, hero_abilities, ability_details):
        self.hero_abilities = hero_abilities
        self.ability_details = ability_details
        self.intents = {}

        self.build_intents()
        self.create_intents_json()
        self.write_files_for_slots()
        self.write_files_for_skill_logic()

    def build_intents(self):
        self.build_intent('GetHeroAbilities', [self.build_slot('Hero', 'LIST_OF_HEROES')])
        self.build_intent('GetAbilityDescription', [self.build_slot('Ability', 'LIST_OF_ABILITIES')])
        self.build_intent('GetAbilityLore', [self.build_slot('Ability', 'LIST_OF_ABILITIES')])
        self.build_intent('GetAbilityNotes', [self.build_slot('Ability', 'LIST_OF_ABILITIES')])
        self.build_intent('GetAbilityCooldown', [self.build_slot('Ability', 'LIST_OF_ABILITIES')])
        self.add_default_intents()


    def build_intent(self, name, slots):
        intent = {}
        intent['intent'] = name
        self.intents.setdefault('intents', []).append(intent)
        for slot in slots:
            intent.setdefault('slots', []).append(slot)

    def build_slot(self, name, slot_type):
        slot = {}
        slot['name'] = name
        slot['type'] = slot_type
        return slot

    def add_default_intents(self):
        self.build_intent('AMAZON.HelpIntent', '')
        self.build_intent('AMAZON.YesIntent', '')
        self.build_intent('AMAZON.NoIntent', '')
        self.build_intent('AMAZON.StopIntent', '')
        self.build_intent('AMAZON.CancelIntent', '')

    def create_intents_json(self):
        script_dir = os.path.join(os.getcwd(), 'speechAssets')
        file_path = os.path.join(script_dir, 'intents.json')
        with open(file_path, 'w+') as out_file:
            json.dump(self.intents, out_file)

    def write_files_for_slots(self):
        script_dir = os.path.join(os.getcwd(), 'speechAssets')

        # Used to create initial name and ability permutation dictionaries. Both such dictionaries are now manually
        # maintained.
        #
        # file_path = os.path.join(script_dir, 'hero_name_permutations.json')
        # with open(file_path, 'w') as out_file:
        #     hero_name_permutations = {}
        #     for hero in self.hero_abilities.keys():
        #         hero_name_permutations[re.sub('s$', '', hero)] = hero
        #     json.dump(hero_name_permutations, out_file)
        #     out_file.close()

        # file_path = os.path.join(script_dir, 'ability_name_permutations.json')
        # with open(file_path, 'w') as out_file:
        #     ability_name_permutations = {}
        #     for ability in self.ability_details.keys():
        #         ability_name_permutations[re.sub('s$|\'s$', '', ability)] = ability
        #     json.dump(ability_name_permutations, out_file)
        #     out_file.close()

        file_path = os.path.join(script_dir, 'hero_names.txt')
        with open(file_path, 'w+') as out_file:
            hero_names_str = '\n'.join(self.hero_abilities.keys())
            out_file.write(hero_names_str)
            out_file.close()

        file_path = os.path.join(script_dir, 'ability_names.txt')
        with open(file_path, 'w+') as out_file:
            ability_names_str = '\n'.join(self.ability_details.keys())
            out_file.write(ability_names_str)
            out_file.close()

    def write_files_for_skill_logic(self):
        script_dir = os.path.join(os.getcwd(), 'src')

        file_path = os.path.join(script_dir, 'hero_abilities.js')
        with open(file_path, 'w+') as out_file:
            out_file.write('module.exports = ' + str(self.hero_abilities) + ';')
            out_file.close()

        file_path = os.path.join(script_dir, 'ability_details.js')
        with open(file_path, 'w+') as out_file:
            out_file.write("module.exports = " + str(self.ability_details) + ';')
            out_file.close()
