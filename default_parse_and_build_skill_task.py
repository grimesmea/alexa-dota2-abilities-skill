from Dota2AbilitiesForAlexa import JsonParser
from Dota2AbilitiesForAlexa import Dota2SkillBuilder

myParser = JsonParser()

Dota2SkillBuilder(myParser.get_hero_abilities(), myParser.get_ability_details())
