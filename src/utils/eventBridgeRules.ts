var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

export const mutateRule = (ruleData) => {
  console.log(ruleData)
  // const RESOURCE_ARN = 'arn:aws:events:us-east-1:994345455620:event-bus/default';
  // var ebMonitor = new AWS.EventBridge({apiVersion: '2015-10-07'});
  // //take rule data and transform it to fit the syntax expected in params
  // var params = {
  //   Entries: [
  //     {
  //       Time: Date.now(),
  //       Detail: '{ \"key1\": \"value1\", \"key2\": \"value2\" }',
  //       DetailType: 'appRequestSubmitted',
  //       Resources: [
  //         'RESOURCE_ARN',
  //       ],
  //       Source: 'com.company.app'
  //     }
  //   ]
  // };
  
  // // creates or updates rule
  // ebMonitor.putRule(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.RuleArn);
  //   }
  // });
  
  // // deletes rule
  // ebMonitor.deleteRule(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.RuleArn);
  //   }
  // });
}



