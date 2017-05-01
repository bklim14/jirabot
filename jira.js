var request = require('request');
var q = require('q');

//jira url
var apiUrl = '';
var issuePath = 'issue/'

module.exports = {
  createCase: function(caseInfo){
    var options = {
        url: apiUrl + issuePath,
        headers:{
            'Authorization': 'Basic YmtsaW06YWRtaW4=',
            'Content-Type': 'application/json'
        },
        json:true
    }
    options.body = caseInfo;
    var deferred = q.defer();
    request.post(options, function(error, response, body){
      if (!error && (response.statusCode == 200||response.statusCode == 201)) {
        var info = body;
        deferred.resolve(info.key);
      }
      else console.log(error);
    });

    return deferred.promise;
  },
  checkCase: function(caseId){
    var deferred = q.defer();
    var options = {
        url: apiUrl + issuePath,
        headers:{
            'Authorization': 'Basic YmtsaW06YWRtaW4=',
            'Content-Type': 'application/json'
        },
        json:true
    }
    
    options.url = options.url + caseId;
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = body;
        deferred.resolve(info.fields.status.name);
      }
    });

    return deferred.promise;
  }  
};
