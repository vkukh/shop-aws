
const basicAuthorizer = async (event, context) => {
  if (!event.authorizationToken) return { statusCode: 401 };

  try {
    const tokenParts = event.authorizationToken.split(' ');
    const token = tokenParts[1];
    const [username, password] = Buffer.from(token, 'base64').toString().split(':');
    
    const storedUsername = process.env.AUTH_USER;
    const storedPassword = process.env.AUTH_PASSWORD;

    if (username === storedUsername && password === storedPassword) {
      const policy = generatePolicy(username, 'Allow', event.methodArn);
      return policy;
    } else {
      return { statusCode: 403 };
    }
  } catch (error) {
    console.log('Error:', error);
    return { statusCode: 500 };
  }
};

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export { basicAuthorizer as handler };