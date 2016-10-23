#DOTA 2 Abilities Skill for Amazon Echo
This is a skill for the Amazon Echo using the Alexa Skills Kit. The data used in this skill is owned by Valve and was obtained at http://www.dota2.com/jsfeed/abilitydata. This project uses data from the Valve Corporation and Dota2 but is not endorsed or certified by Valve or the Dota2 team.

The project uses Python to parse the raw JSON data obtained from http://www.dota2.com/jsfeed/abilitydata. This JSON blob should be saved in the file *abilities.json*. It outputs files used to build the Alexa Skill, both in the Alexa Skills Kit console and the included AWS Lambda function.

The *default_parse_and_build_skill_task.py* task can be run to generate a JSON file with the intent schema (speechAssets/intents.json), text files with a list of valid hero names for the *LIST_OF_HEROS* slot type (speechAssets/hero_names.txt) and a list of valid ability names for the *LIST_OF_ABILITIES* slot type (speechAssets/ability_names.txt).

The files with data needed for the AWS Lambda Function will be output to the src/ directory to use, with any changes to the name permutation files (namePermutations/ability_name_permutations.json and namePermutations/hero_name_permutations.json) copied over to the name permutation JavaScript files in the src/ directory. Basic information about how to setup an AWS Lambda Function for the skill can be found at https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function and can be applied to this project. If building this skill in the Alexa Skills Kit yourself, insert your app id into the file *src/app_id.js*.

`module.exports = [YOUR_APP_ID];`
