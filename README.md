#DOTA2 Abilities Skill for Amazon Echo
This is a skill for the Amazon Echo using the Alexa Skills Kit. The data used in this skill is owned by Valve and was obtained at http://www.dota2.com/jsfeed/abilitydata. This project uses data from the Valve Corporation and Dota2 but is not endorsed or certified by Valve or the Dota2 team.

The project uses Python to parse the raw JSON data obtained from http://www.dota2.com/jsfeed/abilitydata. This JSON blob should be saved in the file *abilities.json*. It outputs files used to build the Alexa Skill, both in the Alexa Skills Kit console and the included AWS Lambda function.

The *default_parse_and_build_skill_task.py* task can be run to generate a JSON file with the intent schema (Dota2AbilitiesForAlex/intents.json), text files with a list of valid hero names for the *LIST_OF_HEROS* slot type (Dota2AbilitiesForAlex/hero_names.txt) and a list of valid ability names for the *LIST_OF_ABILITIES* slot type (Dota2AbilitiesForAlex/ability_names.txt). The files with data needed for the AWS Lambda Function (Dota2AbilitiesForAlex//ability_details.js and Dota2AbilitiesForAlex/hero_abilities.js) will need to be moved to the src/ directory to use with the node.js script.

In the *src/* directory of this project is the AWS Lambda node.js script and associated files. Basic information about how to setup an AWS Lambda Function for the skill can be found at https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function and can be applied to this project. If building this skill in the Alexa Skills Kit yourself, insert your app id into the file *src/app_id.js*.

`module.exports = [YOUR_APP_ID];`

Samples utterances that I have included in the skill thus far include:

```
GetHeroAbilities what are abilities for {Hero}  
GetHeroAbilities what are {Hero} abilities  
GetHeroAbilities what abilities does {Hero} have  
GetHeroAbilities get {Hero} abilities  
GetHeroAbilities tell me about {Hero}  
GetHeroAbilities {Hero}  

GetAbilityDescription what is the description for {Ability}  
GetAbilityDescription what is {Ability} description  
GetAbilityDescription what does {Ability} do  
GetAbilityDescription get {Ability} description  
GetAbilityDescription tell me about {Ability}  
GetAbilityDescription {Ability} description  
GetAbilityDescription {Ability}  

GetAbilityLore what is the lore for {Ability}  
GetAbilityLore what is the lore behind {Ability}  
GetAbilityLore what is {Ability} lore  
GetAbilityLore get {Ability} lore  
GetAbilityLore tell me about {Ability} lore  
GetAbilityLore {Ability} lore  

GetAbilityNotes what notes are there for {Ability}  
GetAbilityNotes what are the notes for {Ability}  
GetAbilityNotes what is {Ability} notes  
GetAbilityNotes get {Ability} notes  
GetAbilityNotes tell me about {Ability} notes  
GetAbilityNotes {Ability} notes  

GetAbilityCooldown what is the cooldown for {Ability}  
GetAbilityCooldown what is the cooldown of {Ability}  
GetAbilityCooldown what is {Ability} cooldown  
GetAbilityCooldown how long before you can cast {Ability} again  
GetAbilityCooldown how long until you can cast {Ability} again  
GetAbilityCooldown how long is {Ability} on cooldown  
GetAbilityCooldown how long is {Ability} cooldown  
GetAbilityCooldown {Ability} cooldown
```
