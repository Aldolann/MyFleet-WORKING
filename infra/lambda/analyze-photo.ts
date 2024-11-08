import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { analyzeVehicleImage } from './utils/rekognition';
import { success, badRequest, serverError } from './utils/response';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocument.from(new DynamoDB({}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { photoKey, inspectionId } = JSON.parse(event.body || '{}');
    
    if (!photoKey || !inspectionId) {
      return badRequest('Missing required parameters');
    }

    // Analyze the image using Rekognition
    const analysis = await analyzeVehicleImage(
      process.env.PHOTO_BUCKET!,
      photoKey
    );

    // Update the inspection record with analysis results
    await dynamodb.update({
      TableName: process.env.INSPECTION_TABLE!,
      Key: { id: inspectionId },
      UpdateExpression: 'SET analyses.#key = :analysis',
      ExpressionAttributeNames: {
        '#key': photoKey,
      },
      ExpressionAttributeValues: {
        ':analysis': analysis,
      },
    });

    return success({
      analysis,
      message: 'Photo analyzed successfully',
    });
  } catch (error) {
    console.error('Error analyzing photo:', error);
    return serverError(error as Error);
  }
};