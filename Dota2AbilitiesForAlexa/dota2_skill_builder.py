import json
import os


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
        self.build_intent('DontKnowIntent', '')
        self.build_intent('AMAZON.StartOverIntent', '')
        self.build_intent('AMAZON.HelpIntent', '')
        self.build_intent('AMAZON.YesIntent', '')
        self.build_intent('AMAZON.NoIntent', '')
        self.build_intent('AMAZON.StopIntent', '')
        self.build_intent('AMAZON.CancelIntent', '')

    def create_intents_json(self):
        print('Creating JSON')
        script_dir = os.path.dirname(__file__)
        file_path = os.path.join(script_dir, 'intents.json')
        print(str(self.intents))
        with open(file_path, 'w') as out_file:
            json.dump(self.intents, out_file)

    def write_files_for_slots(self):
        script_dir = os.path.dirname(__file__)

        file_path = os.path.join(script_dir, 'hero_names.txt')
        with open(file_path, 'w') as out_file:
            hero_names_str = '\n'.join(self.hero_abilities.keys()) \
                             + '\n' + '\'s \n'.join(self.hero_abilities.keys()) + '\'s'
            out_file.write(hero_names_str)
            out_file.close()

        file_path = os.path.join(script_dir, 'ability_names.txt')
        with open(file_path, 'w') as out_file:
            ability_names_str = '\n'.join(self.ability_details.keys()) \
                                + '\n' + '\'s \n'.join(self.ability_details.keys()) + '\'s'
            out_file.write(ability_names_str)
            out_file.close()

    def write_files_for_skill_logic(self):
        script_dir = os.path.dirname(__file__)

        file_path = os.path.join(script_dir, 'hero_abilities.js')
        with open(file_path, 'w') as out_file:
            out_file.write('module.exports = ' + str(self.hero_abilities) + ';')
            out_file.close()

        file_path = os.path.join(script_dir, 'ability_details.js')
        with open(file_path, 'w') as out_file:
            out_file.write("module.exports = " + str(self.ability_details) + ';')
            out_file.close()
