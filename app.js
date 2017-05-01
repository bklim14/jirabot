// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//Bing Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
})

var DialogLabels = {
    CreateCase: 'Create',
    CheckCase: 'Check',
    Support: 'Support'
};

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e1f76d9b-2c14-4506-9150-1d1a961f1a2a?subscription-key=8d1ad9d26062406ca604c00abb754e8c&timezoneOffset=0&verbose=true&q=');
var intentDialog = new builder.IntentDialog({recognizers: [recognizer]});

intentDialog.matches('createCase', '/CreateCase');
intentDialog.matches('checkCase', '/CheckCase');
intentDialog.matches('hello', '/hello');
intentDialog.onDefault('/hello');

bot.dialog('/', intentDialog);

bot.dialog('/CreateCase', require('./createcase'));
bot.dialog('/hello', require ('./hello'));
bot.dialog('/CheckCase', require('./checkcase'));
bot.dialog('/support', require('./support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

