"use strict";

var APP_ID = require("./app_id");
var heroNamePermutations = require("./hero_name_permutations");
var abilityNamePermutations = require("./ability_name_permutations");
var heroAbilities = require("./hero_abilities");
var abilityDetails = require("./ability_details");
var AlexaSkill = require("./AlexaSkill");

/**
 * Dota2AbilitiesSkill is a child of AlexaSkill.
 */
var Dota2AbilitiesSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Dota2AbilitiesSkill.prototype = Object.create(AlexaSkill.prototype);
Dota2AbilitiesSkill.prototype.constructor = Dota2AbilitiesSkill;

Dota2AbilitiesSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Dota2AbilitiesSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

Dota2AbilitiesSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Dota2AbilitiesSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

Dota2AbilitiesSkill.prototype.intentHandlers = {

    "GetHeroAbilities": function (intent, session, response) {
        handleHeroAbilitiesRequest(intent, session, response);
    },

    "GetAbilityDescription": function (intent, session, response) {
        handleAbilityDescriptionRequest(intent, session, response);
    },

    "GetAbilityLore": function (intent, session, response) {
        handleAbilityLoreRequest(intent, session, response);
    },

    "GetAbilityNotes": function (intent, session, response) {
        handleAbilityNotesRequest(intent, session, response);
    },

    "GetAbilityCooldown": function (intent, session, response) {
        handleAbilityCooldownRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask a question like, what are Veneful Spirit's abilities? What is the cooldown for Nether Swap? Or tell me about Magic Missile's lore? or you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, tell me the Magic Missile's cooldown... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

function formatCardTitleName(titleName) {
    for (var i = 0; i < titleName.length; i++) {
        if (i == 0 || titleName.charAt(i-1) == " ") {
            titleName = titleName.substring(0,i) + titleName.charAt(i).toUpperCase() + titleName.substring(i+1);
        }
        if (titleName.charAt(i-1) == "'" && i >= titleName.length - 2) {
            return titleName.substring(0, i+1);
        }
    }
    return titleName;
}

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    var speechText = "Welcome to Dota2 Abilities. You can ask a question like, what are Vengeful Spirit's abilities? What is the cooldown for Netherswap? or tell me the description of Magic Missile ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleHeroAbilitiesRequest(intent, session, response) {
    var itemSlot = intent.slots.Hero;

    var heroName;
    var formattedHeroName;
    var cardTitle;
    var abilities;
    var speechOutput;
    var repromptOutput;
    console.log("Hero item name = " + itemSlot.value)

    if (itemSlot && itemSlot.value){
        var input = itemSlot.value.toLowerCase().replace(/'s$|s$/, "");
        console.log("Normalized hero name = " + input);
        if(input in heroNamePermutations) {
          heroName = heroNamePermutations[input];
        } else {
          heroName = itemSlot.value.toLowerCase().replace(/'s$/, "");
        }
        formattedHeroName = formatCardTitleName(heroName);
        cardTitle = "Abilities: " + formattedHeroName;
        console.log("Hero name = " + heroName);
    }

    if(heroName in heroAbilities) {
      abilities = heroAbilities[heroName];
    }

    if (abilities) {
        speechOutput = abilities.join(", ");
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (heroName) {
            speech = "I'm sorry, I could not find abilities for the hero " + formattedHeroName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know abilities for that hero. What else can I help with?";
        }
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "What else can I help with?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
 function handleAbilityDescriptionRequest(intent, session, response) {
     var itemSlot = intent.slots.Ability;

     var abilityName;
     var formattedAbilityName;
     var cardTitle;
     var description;
     var speechOutput;
     var repromptOutput;
     console.log("Ability item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         var input = itemSlot.value.toLowerCase().replace(/'s$|s$/, "");
         console.log("Normalized ability name = " + input);
         if(input in abilityNamePermutations) {
           abilityName = abilityNamePermutations[input];
         } else {
           abilityName = itemSlot.value.toLowerCase().replace(/'s$/, "");
         }
         formattedAbilityName = formatCardTitleName(abilityName);
         cardTitle = "Description: " + formattedAbilityName;
         console.log("Ability name = " + abilityName);
     }

    if(abilityName in abilityDetails) {
       description = abilityDetails[abilityName]["description"]
    }

    if (description) {
         speechOutput = description;
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (abilityName) {
            speech = "I'm sorry, I could not find a description for the ability " + formattedAbilityName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know  ability. What else can I help with?";
        }
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "What else can I help with?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
  }

/**
 * Gets a poster prepares the speech to reply to the user.
 */
 function handleAbilityLoreRequest(intent, session, response) {
     var itemSlot = intent.slots.Ability;

     var abilityName;
     var formattedAbilityName;
     var cardTitle;
     var lore;
     var speechOutput;
     var repromptOutput;
     console.log("Ability item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         var input = itemSlot.value.toLowerCase().replace(/'s$|s$/, "");
         console.log("Normalized ability name = " + input);
         if(input in abilityNamePermutations) {
           abilityName = abilityNamePermutations[input];
         } else {
           abilityName = itemSlot.value.toLowerCase().replace(/'s$/, "");
         }
         formattedAbilityName = formatCardTitleName(abilityName);
         cardTitle = "Lore: " + formattedAbilityName;
         console.log("Ability name = " + abilityName);
     }

    if(abilityName in abilityDetails) {
       lore = abilityDetails[abilityName]["lore"]
    }

    if (lore) {
         if(lore == "") {
             speechOutput = abilityName + " does not have any lore.";
         } else {
             speechOutput = lore;
         }
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (abilityName) {
            speech = "I'm sorry, I could not find lore for the ability " + formattedAbilityName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know lore for that ability. What else can I help with?";
        }
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "What else can I help with?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
}

 /**
 * Gets a poster prepares the speech to reply to the user.
 */
 function handleAbilityNotesRequest(intent, session, response) {
     var itemSlot = intent.slots.Ability;

     var abilityName;
     var formattedAbilityName;
     var cardTitle;
     var notes;
     var speechOutput;
     var repromptOutput;

     console.log("Ability item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         var input = itemSlot.value.toLowerCase().replace(/'s$|s$/, "");
         console.log("Normalized ability name = " + input);
         if(input in abilityNamePermutations) {
           abilityName = abilityNamePermutations[input];
         } else {
           abilityName = itemSlot.value.toLowerCase().replace(/'s$/, "");
         }
         formattedAbilityName = formatCardTitleName(abilityName);
         cardTitle = "Notes: " + formattedAbilityName;
         console.log("Ability name = " + abilityName);
     }

    if(abilityName in abilityDetails) {
       notes = abilityDetails[abilityName]["notes"]
    }

    if (notes) {
         if(notes == "") {
             speechOutput = abilityName + " does not have any notes.";
         } else {
             speechOutput = notes;
         }
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (abilityName) {
            speech = "I'm sorry, I could not find any notes for the ability " + formattedAbilityName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know notes for that ability. What else can I help with?";
        }
        speechOutput = {
            speech: speech,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        repromptOutput = {
            speech: "What else can I help with?",
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
  }

  /**
  * Gets a poster prepares the speech to reply to the user.
  */
  function handleAbilityCooldownRequest(intent, session, response) {
      var itemSlot = intent.slots.Ability;

      var abilityName;
      var formattedAbilityName;
      var cardTitle;
      var cooldown;
      var speechOutput;
      var cardOutput;
      var repromptOutput;
      console.log("Ability item name = " + itemSlot.value);

      if (itemSlot && itemSlot.value){
         var input = itemSlot.value.toLowerCase().replace(/'s$|s$/, "");
         console.log("Normalized ability name = " + input);
         if(input in abilityNamePermutations) {
           abilityName = abilityNamePermutations[input];
         } else {
           abilityName = itemSlot.value.toLowerCase().replace(/'s$/, "");
         }
         formattedAbilityName = formatCardTitleName(abilityName);
         cardTitle = "Cooldown: " + formattedAbilityName;
         console.log("Ability name = " + abilityName);
      }


     if(abilityName in abilityDetails) {
        cooldown = abilityDetails[abilityName]["cooldown"]
     }

     if (cooldown) {
          if(cooldown.length < 1 || cooldown == "''") {
              speechOutput = formattedAbilityName + " does not have a cooldown.";
              cardOutput = speechOutput;
          } else {
              cardOutput = cooldown.replace(/\'|\'/g, "") + " seconds"
              speechOutput = cooldown.replace(/\//g, ", ") + " seconds";
          }
          response.tellWithCard(speechOutput, cardTitle, cardOutput);
     } else {
         var speech;
         if (abilityName) {
             speech = "I'm sorry, I could not find the cooldown for the ability " + formattedAbilityName + ". What else can I help with?";
         } else {
             speech = "I'm sorry, I currently do not know cooldowns for that ability. What else can I help with?";
         }
         speechOutput = {
             speech: speech,
             type: AlexaSkill.speechOutputType.PLAIN_TEXT
         };
         repromptOutput = {
             speech: "What else can I help with?",
             type: AlexaSkill.speechOutputType.PLAIN_TEXT
         };
         response.ask(speechOutput, repromptOutput);
     }
   }

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context, callback) {
    // Create an instance of the Dota2Abilities Skill.
    var skill = new Dota2AbilitiesSkill();
    skill.execute(event, context);
};
