// adapted from https://github.com/awslabs/serverless-application-model/blob/master/examples/2016-10-31/api_lambda_token_auth/src/authorizer.js

exports.handler = async function(event) {
  const token = event.authorizationToken.toLowerCase();
  const methodArn = event.methodArn;

  switch (token) {
    case 'allow':
      return generateAuthResponse('user123', 'Allow', methodArn);
    case 'deny':
      return generateAuthResponse('user123', 'Deny', methodArn);
    default:
      return Promise.reject('Error: Invalid token');
  }
};

function generateAuthResponse(principalId, effect, methodArn) {
  if (!effect || !methodArn) return null;

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: methodArn // Caution! This will be cached. See gotchas in README.
        }
      ]
    }
  };
}
