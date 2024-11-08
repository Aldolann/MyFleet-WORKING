import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

export const createDynamoDBTables = (scope: cdk.Stack) => {
  // Fleet Table
  const fleetTable = new dynamodb.Table(scope, 'FleetTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    timeToLiveAttribute: 'ttl',
  });

  // Add GSI for admin lookup
  fleetTable.addGlobalSecondaryIndex({
    indexName: 'AdminIndex',
    partitionKey: { name: 'adminId', type: dynamodb.AttributeType.STRING },
    projectionType: dynamodb.ProjectionType.ALL,
  });

  // Vehicle Table
  const vehicleTable = new dynamodb.Table(scope, 'VehicleTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    timeToLiveAttribute: 'ttl',
  });

  // Add GSI for status lookup
  vehicleTable.addGlobalSecondaryIndex({
    indexName: 'StatusIndex',
    partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
    projectionType: dynamodb.ProjectionType.ALL,
  });

  // Driver Table
  const driverTable = new dynamodb.Table(scope, 'DriverTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    timeToLiveAttribute: 'ttl',
  });

  // Add GSI for status lookup
  driverTable.addGlobalSecondaryIndex({
    indexName: 'StatusIndex',
    partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
    projectionType: dynamodb.ProjectionType.ALL,
  });

  // Inspection Table
  const inspectionTable = new dynamodb.Table(scope, 'InspectionTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'vehicleId', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    timeToLiveAttribute: 'ttl',
  });

  // Add GSI for date lookup
  inspectionTable.addGlobalSecondaryIndex({
    indexName: 'DateIndex',
    partitionKey: { name: 'date', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
    projectionType: dynamodb.ProjectionType.ALL,
  });

  // Add GSI for driver lookup
  inspectionTable.addGlobalSecondaryIndex({
    indexName: 'DriverIndex',
    partitionKey: { name: 'driverId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'date', type: dynamodb.AttributeType.STRING },
    projectionType: dynamodb.ProjectionType.ALL,
  });

  return {
    fleetTable,
    vehicleTable,
    driverTable,
    inspectionTable,
  };
};