"use strict";
const dialogflow = require("dialogflow");
const structjson = require("structjson");
const config = require("../config/keys");
const projectId = config.googleProjectID;
const sessionId = "bot-session-";

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};
const Session = require("../models/session");

const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

const DetectLanguage = require("detectlanguage");

const detectLanguage = new DetectLanguage({
  key: "11e3c4ee547466256cb64048503dee95",
  ssl: true || false,
});

module.exports = {
  textQuery: async function (
    text,
    identifier,
    messageIdentifier,
    langCode,
    parameters = {}
  ) {
    let self = module.exports;

    let sessionPath = sessionClient.sessionPath(
      projectId,
      sessionId + identifier
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);

    console.log(responses);
    console.log(`responses >> ${responses}`);
    console.log(`identifier >> ${identifier}`);
    console.log(`messageIdentifier >> ${messageIdentifier}`);
    console.log(`langCode >> ${langCode}`);
    // console.log(`command >> ${command}`);
    self.handleAction(responses, identifier, messageIdentifier);
    return responses;
  },
  eventQuery: async function (
    event,
    identifier,
    messageIdentifier,
    languageCode,
    parameters = {}
  ) {
    let sessionPath = sessionClient.sessionPath(
      projectId,
      sessionId + identifier
    );
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC.
          // a jsonToStructProto method to convert the  JS object to a proto struct.
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    // responses = await self.handleAction(
    //   responses,
    //   identifier,
    //   messageIdentifier,
    //   languageCode
    // );
    return responses;
  },

  handleAction: function (
    responses,
    identifier,
    messageIdentifier,
    languageCode
  ) {
    let self = module.exports;
    let fulfillmentMessages = responses[0].queryResult.fulfillmentMessages;
    let intent = responses[0].queryResult.intent.displayName; //intet name
    self.saveSession(
      fulfillmentMessages,
      identifier,
      intent,
      messageIdentifier,
      languageCode
    );
    return responses;
  },

  saveSession: async function (
    fulfillmentMessages,
    identifier,
    intent,
    messageIdentifier,
    languageCode
  ) {
    const newSession = new Session({
      session_id: sessionId + identifier,
      replies: {
        msg: fulfillmentMessages,
        locale_key: languageCode + "." + intent,
        reply_to: messageIdentifier,
      },
      message: {
        identifier: messageIdentifier,
        detected_language: languageCode,
      },
    });
    try {
      let ses = await newSession.save();
    } catch (err) {
      console.log(err);
    }
  },
};
