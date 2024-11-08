import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = DynamoDBDocument.from(new DynamoDB({}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, resource, body, requestContext } = event;
    const fleetId = requestContext.authorizer?.claims?.['custom:fleetId'];

    switch (`${httpMethod} ${resource}`) {
      case 'GET /drivers': {
        const result = await dynamodb.query({
          TableName: process.env.DRIVER_TABLE!,
          KeyConditionExpression: 'fleetId = :fleetId',
          ExpressionAttributeValues: {
            ':fleetId': fleetId,
          },
        });

        return {
          statusCode: 200,
          body: JSON.stringify(result.Items),
        };
      }

      case 'POST /drivers': {
        if (!body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
          };
        }

        const driverData = JSON.parse(body);
        await dynamodb.put({
          TableName: process.env.DRIVER_TABLE!,
          Item: {
            ...driverData,
            fleetId,
            createdAt: new Date().toISOString(),
          },
        });

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Driver created successfully' }),
        };
      }

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};