"use strict";

var APP_ID = require("./app_id");
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
    var speechText = "Welcome to Dota2 Abilities. You can ask a question like, what are Veneful Spirit's abilities? What is the cooldown for Netherswap? or what are the details of Magic Missile ... Now, what can I help you with.";
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
    var itemName;
    console.log(" Item name = " + itemSlot.value)

    if (itemSlot && itemSlot.value){
        itemName = itemSlot.value.toLowerCase().replace(/'s$/, '');
    }

    var formattedItemName = formatCardTitleName(itemName);
    var cardTitle = "Abilities: " + formattedItemName;
    var abilities;
    var speechOutput;
    var repromptOutput;

    if(itemName in heroAbilities) {
      abilities = heroAbilities[itemName];
    }

    if (abilities) {
        speechOutput = abilities.join(", ");
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (itemName) {
            speech = "I'm sorry, I do not know about " + formattedItemName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know that hero. What else can I help with?";
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
     var itemName;
     console.log("Item slot = " + itemSlot + " Item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         itemName = itemSlot.value.toLowerCase().replace(/'s$/, '');
         if(itemName == "slam") {
           itemName = "echo slam"
         }
     }

    var formattedItemName = formatCardTitleName(itemName);
    var cardTitle = "Description: " + formattedItemName;
    var description;
    var speechOutput;
    var repromptOutput;

    if(itemName in abilityDetails) {
       description = abilityDetails[itemName]["description"]
    }

    if (description) {
         speechOutput = description;
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (itemName) {
            speech = "I'm sorry, I do not know about " + formattedItemName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know that ability. What else can I help with?";
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
     var itemName;
     console.log("Item slot = " + itemSlot + " Item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         itemName = itemSlot.value.toLowerCase().replace(/'s$/, '');
         if(itemName == "slam") {
           itemName = "echo slam"
         }
     }

    var formattedItemName = formatCardTitleName(itemName);
    var cardTitle = "Lore: " + formattedItemName;
    var lore;
    var speechOutput;
    var repromptOutput;

    if(itemName in abilityDetails) {
       lore = abilityDetails[itemName]["lore"]
    }

    if (lore) {
         if(lore == "") {
             speechOutput = itemName + " does not have any lore.";
         } else {
             speechOutput = lore;
         }
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (itemName) {
            speech = "I'm sorry, I do not know lore for " + formattedItemName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know that ability. What else can I help with?";
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
     var itemName;
     console.log("Item slot = " + itemSlot + " Item name = " + itemSlot.value);

     if (itemSlot && itemSlot.value){
         itemName = itemSlot.value.toLowerCase().replace(/'s$/, '');
         if(itemName == "slam") {
           itemName = "echo slam"
         }
     }

    var formattedItemName = formatCardTitleName(itemName);
    var cardTitle = "Notes: " + formattedItemName;
    var notes;
    var speechOutput;
    var repromptOutput;

    if(itemName in abilityDetails) {
       notes = abilityDetails[itemName]["notes"]
    }

    if (notes) {
         if(notes == "") {
             speechOutput = itemName + " does not have any notes.";
         } else {
             speechOutput = notes;
         }
         response.tellWithCard(speechOutput, cardTitle, speechOutput);
    } else {
        var speech;
        if (itemName) {
            speech = "I'm sorry, I did not find any notes for " + formattedItemName + ". What else can I help with?";
        } else {
            speech = "I'm sorry, I currently do not know about that ability. What else can I help with?";
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
      var itemName;
      console.log("Item slot = " + itemSlot + " Item name = " + itemSlot.value);

      if (itemSlot && itemSlot.value){
          itemName = itemSlot.value.toLowerCase().replace(/'s$/, "");
          if(itemName == "slam") {
            itemName = "echo slam"
          }
      }

     var formattedItemName = formatCardTitleName(itemName);
     var cardTitle = "Cooldown: " + formattedItemName;
     var cooldown;
     var speechOutput;
     var cardOutput;
     var repromptOutput;

     if(itemName in abilityDetails) {
        cooldown = abilityDetails[itemName]["cooldown"]
     }

     if (cooldown) {
          if(cooldown.length < 1 || cooldown == "''") {
              speechOutput = formattedItemName + " does not have a cooldown.";
              cardOutput = speechOutput;
          } else {
              cardOutput = cooldown.replace(/\'|\'/g, "") + " seconds"
              speechOutput = cooldown.replace(/\//g, ", ") + " seconds";
          }
          response.tellWithCard(speechOutput, cardTitle, cardOutput);
     } else {
         var speech;
         if (itemName) {
             speech = "I'm sorry, I do not know about the cooldown for " + formattedItemName + ". What else can I help with?";
         } else {
             speech = "I'm sorry, I currently do not know about that ability. What else can I help with?";
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
