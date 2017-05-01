var DialogLabels = {
    CreateCase: 'Create',
    CheckCase: 'Check',
    Support: 'Support'
};
var builder = require('botbuilder');
module.exports =  [

function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Hi, I can assist you to log a ticket.',
            'Create|Check|Support',
            {
                maxRetries: 3,
                retryPrompt: 'Sorry I dont understand. Can you please try again?'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.CreateCase:
                return session.beginDialog('/CreateCase');
            case DialogLabels.CheckCase:
                return session.beginDialog('/CheckCase');
        }
    }
]
