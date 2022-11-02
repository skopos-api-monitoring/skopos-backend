var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

export const mutateRule = (ruleData) => {
  var ebMonitor = new AWS.EventBridge({apiVersion: '2015-10-07'});
  
  // creates or updates rule
  ebMonitor.putRule(ruleData, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.RuleArn);
    }
  });
  
  // deletes rule
  ebMonitor.deleteRule(ruleData, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.RuleArn);
    }
  });
}


