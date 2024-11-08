import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

interface LambdaProps {
  fleetTable: dynamodb.Table;
  vehicleTable: dynamodb.Table;
  driverTable: dynamodb.Table;
  inspectionTable: dynamodb.Table;
  photoBucket: s3.Bucket;
}

export const createLambdaFunctions = (scope: cdk.Stack, props: LambdaProps) => {
  const commonEnvironment = {
    FLEET_TABLE: props.fleetTable.tableName,
    VEHICLE_TABLE: props.vehicleTable.tableName,
    DRIVER_TABLE: props.driverTable.tableName,
    INSPECTION_TABLE: props.inspectionTable.tableName,
    PHOTO_BUCKET: props.photoBucket.bucketName,
  };

  // Fleet Lambda
  const fleetLambda = new lambdaNodejs.NodejsFunction(scope, 'FleetFunction', {
    entry: path.join(__dirname, '../lambda/fleet.ts'),
    handler: 'handler',
    runtime: lambda.Runtime.NODEJS_18_X,
    environment: commonEnvironment,
    timeout: cdk.Duration.seconds(30),
    memorySize: 1024,
    bundling: {
      minify: true,
      sourceMap: true,
    },
  });

  // Grant permissions
  props.fleetTable.grantReadWriteData(fleetLambda);
  props.vehicleTable.grantReadWriteData(fleetLambda);
  props.driverTable.grantReadWriteData(fleetLambda);
  props.inspectionTable.grantReadWriteData(fleetLambda);
  props.photoBucket.grantReadWrite(fleetLambda);

  return {
    fleetLambda,
  };
};