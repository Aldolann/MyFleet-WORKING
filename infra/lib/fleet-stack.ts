import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { createFleetServiceRole, createUserRole, createAdminRole } from './iam-policies';

export class FleetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'FleetUserPool', {
      userPoolName: 'fleet-user-pool',
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      customAttributes: {
        role: new cognito.StringAttribute({ mutable: true }),
        fleetId: new cognito.StringAttribute({ mutable: true }),
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    // User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, 'FleetUserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:5173'], // Add your domains in production
      },
    });

    // DynamoDB Tables
    const fleetTable = new dynamodb.Table(this, 'FleetTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const vehicleTable = new dynamodb.Table(this, 'VehicleTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const driverTable = new dynamodb.Table(this, 'DriverTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'fleetId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const inspectionTable = new dynamodb.Table(this, 'InspectionTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'vehicleId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // S3 Bucket for vehicle photos
    const photoBucket = new s3.Bucket(this, 'VehiclePhotoBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'], // Restrict in production
          allowedHeaders: ['*'],
        },
      ],
    });

    // Lambda Functions
    const fleetLambda = new lambdaNodejs.NodejsFunction(this, 'FleetFunction', {
      entry: path.join(__dirname, '../lambda/fleet.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        FLEET_TABLE: fleetTable.tableName,
        VEHICLE_TABLE: vehicleTable.tableName,
        DRIVER_TABLE: driverTable.tableName,
        INSPECTION_TABLE: inspectionTable.tableName,
        PHOTO_BUCKET: photoBucket.bucketName,
      },
    });

    // Photo Analysis Lambda
    const analyzePhotoLambda = new lambdaNodejs.NodejsFunction(this, 'AnalyzePhotoFunction', {
      entry: path.join(__dirname, '../lambda/analyze-photo.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        INSPECTION_TABLE: inspectionTable.tableName,
        PHOTO_BUCKET: photoBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // Grant Lambda permissions
    fleetTable.grantReadWriteData(fleetLambda);
    vehicleTable.grantReadWriteData(fleetLambda);
    driverTable.grantReadWriteData(fleetLambda);
    inspectionTable.grantReadWriteData(fleetLambda);
    photoBucket.grantReadWrite(fleetLambda);

    // Grant Rekognition permissions to analyze photos
    analyzePhotoLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'rekognition:DetectLabels',
        'rekognition:DetectModerationLabels',
      ],
      resources: ['*'],
    }));

    // API Gateway
    const api = new apigateway.RestApi(this, 'FleetApi', {
      restApiName: 'Fleet Management API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API Gateway Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'FleetApiAuthorizer', {
      cognitoUserPools: [userPool],
    });

    // API Resources and Methods
    const fleetResource = api.root.addResource('fleet');
    fleetResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
    fleetResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const vehiclesResource = api.root.addResource('vehicles');
    vehiclesResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
    vehiclesResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Photo Analysis Endpoint
    const analyzePhotoResource = api.root.addResource('analyze-photo');
    analyzePhotoResource.addMethod('POST', new apigateway.LambdaIntegration(analyzePhotoLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Create IAM Roles
    const serviceRole = createFleetServiceRole(this, 'FleetServiceRole');
    const userRole = createUserRole(this, 'FleetUserRole', userPool.userPoolId);
    const adminRole = createAdminRole(this, 'FleetAdminRole', userPool.userPoolId);

    // Output values
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'PhotoBucketName', {
      value: photoBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    });
  }
}