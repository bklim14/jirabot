var builder = require('botbuilder');
var jira = require('./jira');

var caseTemplate = {
    "fields": {
    	"project": {
    		"id": "10000"
    	},
        "issuetype": {
            "id": "10002"
        },
        "priority": {},
        "duedate": "2017-05-11"
    }
};

module.exports = [
    function (session, results) {
        builder.Prompts.text(session, "Please choose a severity - 1(Highest) 2(High) 3(Medium) 4(Low) 5(Lowest)");       
    },
    function (session, results) {
        session.userData.severity = results.response;
        caseTemplate.fields.priority.id = results.response;
        builder.Prompts.text(session, "Creating severity '" + results.response + "' case. What is the issue you are facing? Case title:");
    },

    function (session, results) {
        session.userData.title = results.response;
        caseTemplate.fields.summary = results.response;
        builder.Prompts.text(session, "The case title is - " + results.response + ". Please describe as detail as possible the issue.");
    },

    function (session, results, next) {
        session.userData.desc = results.response;
        caseTemplate.fields.description = results.response;
        session.send("Got it... " + "I have created severity "+ session.userData.severity + " case" +
                    " " + session.userData.title + "" +
                    " " + session.userData.desc + ".");
        next();
    },

    function (session) {
    // Generate ticket
      jira.createCase(caseTemplate)
      .then((key) => {
        session.send('Thanks for contacting the support team. Your ticket number is %s.', key + '. We have dropped you an email and will be in touch shortly or you may see the status of the ticket on this link: https://e1279006.ngrok.io/browse/' + key);  
        session.endDialogWithResult({
          response: key
        });
      });
    }  
];