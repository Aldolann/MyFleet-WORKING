import * as iam from 'aws-cdk-lib/aws-iam';

export const createFleetServiceRole = (scope: any, id: string) => {
  return new iam.Role(scope, id, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    description: 'Custom role for Fleet Management service',
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
    inlinePolicies: {
      FleetServicePolicy: new iam.PolicyDocument({
        statements: [
          // DynamoDB Access
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:Query',
              'dynamodb:Scan'
            ],
            resources: [
              'arn:aws:dynamodb:*:*:table/Fleet*',
              'arn:aws:dynamodb:*:*:table/Vehicle*',
              'arn:aws:dynamodb:*:*:table/Driver*',
              'arn:aws:dynamodb:*:*:table/Inspection*'
            ],
          }),
          // S3 Access
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              's3:GetObject',
              's3:PutObject',
              's3:DeleteObject'
            ],
            resources: ['arn:aws:s3:::fleet-photos/*'],
          }),
          // Cognito Access
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'cognito-idp:AdminCreateUser',
              'cognito-idp:AdminSetUserPassword',
              'cognito-idp:AdminUpdateUserAttributes'
            ],
            resources: ['arn:aws:cognito-idp:*:*:userpool/*'],
          }),
        ],
      }),
    },
  });
};

export const createUserRole = (scope: any, id: string, userPool: string) => {
  return new iam.Role(scope, id, {
    assumedBy: new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com', {
      'StringEquals': {
        'cognito-identity.amazonaws.com:aud': userPool
      },
    }),
    description: 'Role for authenticated fleet management users',
    inlinePolicies: {
      UserPolicy: new iam.PolicyDocument({
        statements: [
          // S3 Access for Photos
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              's3:GetObject',
              's3:PutObject'
            ],
            resources: ['arn:aws:s3:::fleet-photos/${cognito-identity.amazonaws.com:sub}/*'],
          }),
          // DynamoDB Access - Read Only for most tables
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan'
            ],
            resources: [
              'arn:aws:dynamodb:*:*:table/Fleet*',
              'arn:aws:dynamodb:*:*:table/Vehicle*',
              'arn:aws:dynamodb:*:*:table/Driver*'
            ],
          }),
          // DynamoDB Access - Write for Inspections
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'dynamodb:PutItem',
              'dynamodb:UpdateItem'
            ],
            resources: ['arn:aws:dynamodb:*:*:table/Inspection*'],
            conditions: {
              'ForAllValues:StringEquals': {
                'dynamodb:LeadingKeys': ['${cognito-identity.amazonaws.com:sub}']
              }
            },
          }),
        ],
      }),
    },
  });
};

export const createAdminRole = (scope: any, id: string, userPool: string) => {
  return new iam.Role(scope, id, {
    assumedBy: new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com', {
      'StringEquals': {
        'cognito-identity.amazonaws.com:aud': userPool,
        'cognito-identity.amazonaws.com:amr': 'authenticated'
      },
    }),
    description: 'Role for fleet management administrators',
    inlinePolicies: {
      AdminPolicy: new iam.PolicyDocument({
        statements: [
          // Full access to fleet resources
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'dynamodb:*'
            ],
            resources: [
              'arn:aws:dynamodb:*:*:table/Fleet*',
              'arn:aws:dynamodb:*:*:table/Vehicle*',
              'arn:aws:dynamodb:*:*:table/Driver*',
              'arn:aws:dynamodb:*:*:table/Inspection*'
            ],
            conditions: {
              'ForAllValues:StringEquals': {
                'dynamodb:LeadingKeys': ['${cognito-identity.amazonaws.com:sub}']
              }
            },
          }),
          // S3 Management
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              's3:*'
            ],
            resources: [
              'arn:aws:s3:::fleet-photos',
              'arn:aws:s3:::fleet-photos/*'
            ],
          }),
        ],
      }),
    },
  });
};