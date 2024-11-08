import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocument.from(new DynamoDB({}));

export const getItem = async (tableName: string, key: Record<string, any>) => {
  const result = await dynamodb.get({
    TableName: tableName,
    Key: key,
  });
  return result.Item;
};

export const putItem = async (tableName: string, item: Record<string, any>) => {
  await dynamodb.put({
    TableName: tableName,
    Item: item,
  });
};

export const queryItems = async (
  tableName: string,
  keyCondition: string,
  expressionValues: Record<string, any>,
  indexName?: string
) => {
  const params: any = {
    TableName: tableName,
    KeyConditionExpression: keyCondition,
    ExpressionAttributeValues: expressionValues,
  };

  if (indexName) {
    params.IndexName = indexName;
  }

  const result = await dynamodb.query(params);
  return result.Items;
};

export const updateItem = async (
  tableName: string,
  key: Record<string, any>,
  updateExpression: string,
  expressionValues: Record<string, any>,
  expressionNames?: Record<string, string>
) => {
  const params: any = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionValues,
  };

  if (expressionNames) {
    params.ExpressionAttributeNames = expressionNames;
  }

  await dynamodb.update(params);
};

export const deleteItem = async (tableName: string, key: Record<string, any>) => {
  await dynamodb.delete({
    TableName: tableName,
    Key: key,
  });
};