import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export const createApiGateway = (
  scope: cdk.Stack,
  fleetLambda: lambda.Function,
  userPool: cognito.UserPool
) => {
  // Create API Gateway
  const api = new apigateway.RestApi(scope, 'FleetApi', {
    restApiName: 'Fleet Management API',
    description: 'API for fleet management system',
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
      ],
      maxAge: cdk.Duration.days(1),
    },
  });

  // Create Cognito Authorizer
  const authorizer = new apigateway.CognitoUserPoolsAuthorizer(scope, 'FleetApiAuthorizer', {
    cognitoUserPools: [userPool],
  });

  const authorizerProps = {
    authorizer,
    authorizationType: apigateway.AuthorizationType.COGNITO,
  };

  // Fleet Endpoints
  const fleetResource = api.root.addResource('fleet');
  fleetResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  fleetResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  // Vehicle Endpoints
  const vehiclesResource = api.root.addResource('vehicles');
  vehiclesResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  vehiclesResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  const vehicleResource = vehiclesResource.addResource('{vehicleId}');
  vehicleResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  vehicleResource.addMethod('PUT', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  vehicleResource.addMethod('DELETE', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  // Driver Endpoints
  const driversResource = api.root.addResource('drivers');
  driversResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  driversResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  const driverResource = driversResource.addResource('{driverId}');
  driverResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  driverResource.addMethod('PUT', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  driverResource.addMethod('DELETE', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  // Inspection Endpoints
  const inspectionsResource = api.root.addResource('inspections');
  inspectionsResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  inspectionsResource.addMethod('POST', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  const inspectionResource = inspectionsResource.addResource('{inspectionId}');
  inspectionResource.addMethod('GET', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);
  inspectionResource.addMethod('PUT', new apigateway.LambdaIntegration(fleetLambda), authorizerProps);

  return api;
};