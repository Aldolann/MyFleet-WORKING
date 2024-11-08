import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const cognito = new CognitoIdentityProviderClient({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, body } = event;

    if (httpMethod === 'POST' && body) {
      const { email, password, role, fleetId } = JSON.parse(body);

      // Create user in Cognito
      await cognito.send(new AdminCreateUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'custom:role', Value: role },
          { Name: 'custom:fleetId', Value: fleetId },
        ],
        MessageAction: 'SUPPRESS',
      }));

      // Set permanent password
      await cognito.send(new AdminSetUserPasswordCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
      }));

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'User created successfully' }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};