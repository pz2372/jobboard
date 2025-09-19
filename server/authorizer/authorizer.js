const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    // Get the JWT token from the Authorization header
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Generate IAM policy
    return generatePolicy(decoded.userId, 'Allow', event.methodArn);
  } catch (error) {
    console.error('Authorization error:', error);
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};

// Helper function to generate IAM policy
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId: principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}; 