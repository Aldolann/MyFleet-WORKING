import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = DynamoDBDocument.from(new DynamoDB({}));
const s3 = new S3({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, resource, body, requestContext } = event;
    const userId = requestContext.authorizer?.claims?.sub;
    const fleetId = requestContext.authorizer?.claims?.['custom:fleetId'];

    switch (`${httpMethod} ${resource}`) {
      case 'GET /inspections': {
        const { vehicleId, date } = event.queryStringParameters || {};
        
        const params: any = {
          TableName: process.env.INSPECTION_TABLE!,
          KeyConditionExpression: 'vehicleId = :vehicleId',
          ExpressionAttributeValues: {
            ':vehicleId': vehicleId,
            ':fleetId': fleetId,
          },
          FilterExpression: 'fleetId = :fleetId',
        };

        if (date) {
          params.KeyConditionExpression += ' AND #date = :date';
          params.ExpressionAttributeValues[':date'] = date;
          params.ExpressionAttributeNames = { '#date': 'date' };
        }

        const result = await dynamodb.query(params);

        return {
          statusCode: 200,
          body: JSON.stringify(result.Items),
        };
      }

      case 'POST /inspections': {
        if (!body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
          };
        }

        const inspectionData = JSON.parse(body);
        await dynamodb.put({
          TableName: process.env.INSPECTION_TABLE!,
          Item: {
            ...inspectionData,
            fleetId,
            createdAt: new Date().toISOString(),
            createdBy: userId,
          },
        });

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Inspection created successfully' }),
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