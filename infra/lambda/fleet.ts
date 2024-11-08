import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = DynamoDBDocument.from(new DynamoDB({}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, resource, body, requestContext } = event;
    const userId = requestContext.authorizer?.claims?.sub;
    
    // Get user's fleet ID from Cognito claims
    const fleetId = requestContext.authorizer?.claims?.['custom:fleetId'];

    switch (`${httpMethod} ${resource}`) {
      case 'GET /fleet': {
        const result = await dynamodb.get({
          TableName: process.env.FLEET_TABLE!,
          Key: { id: fleetId },
        });
        
        return {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
      }

      case 'GET /vehicles': {
        const result = await dynamodb.query({
          TableName: process.env.VEHICLE_TABLE!,
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

      case 'POST /vehicles': {
        if (!body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
          };
        }

        const vehicleData = JSON.parse(body);
        await dynamodb.put({
          TableName: process.env.VEHICLE_TABLE!,
          Item: {
            ...vehicleData,
            fleetId,
            createdAt: new Date().toISOString(),
            createdBy: userId,
          },
        });

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Vehicle created successfully' }),
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