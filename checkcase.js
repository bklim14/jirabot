var builder = require('botbuilder');
var jira = require('./jira');

module.exports = [
    // Destination
    function (session) {
        builder.Prompts.text(session, 'Please enter your issue id.');
    },
    function (session, results, next) {
        session.dialogData.destination = results.response;
        jira.checkCase(results.response)
        .then((status) => {
          session.send('The status of the ticket is %s', status);
          session.endDialog();
        // next();
        });
    }
];