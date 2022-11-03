var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

export const addOrUpdateRule = (data, collectionIds) => {
  const ebMonitor = new AWS.EventBridge({apiVersion: '2015-10-07'});
  //take rule data and transform it to fit the syntax expected in params

  var monitorParams = {
    Name: 'default',
    EventBusName: process.env.EB_ARN,
    RoleArn: process.env.EB_ROLE_ARN,
    ScheduleExpression: `rate(${data.schedule})`,
    State: "ENABLED",
    Tags: [
      {
        Key: 'email',
        Value: data.contactInfo 
      },
    ]
  };
  
 // creates or updates rule
  collectionIds.connect.forEach(async ({ id }) => {
    monitorParams.Name = `${data.id}.${id}`

    var apiParams = {
      ConnectionArn: process.env.EB_ARN, /* required */
      HttpMethod: "POST",  /* required */
      InvocationEndpoint: `http://localhost:3001/run-collection/${id}`, /* required */
      Name: `api endpoint for ${id}`, /* required */
      InvocationRateLimitPerSecond: 1
    };

    var authParams = {
      AuthParameters: { /* required */
        ApiKeyAuthParameters: {
          ApiKeyName: 'test', /* required */
          ApiKeyValue: 'test' /* required */
        },
      },
      AuthorizationType: "API_KEY", /* required */
      Name: 'STRING_VALUE', /* required */
    };

    await ebMonitor.createConnection(authParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

    await ebMonitor.createApiDestination(apiParams, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

    await ebMonitor.putRule(monitorParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.RuleArn);
      }
    });
  })

  
  // // deletes rule
  // ebMonitor.deleteRule(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.RuleArn);
  //   }
  // });
}



