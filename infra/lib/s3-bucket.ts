import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';

export const createPhotoBucket = (scope: cdk.Stack) => {
  const bucket = new s3.Bucket(scope, 'VehiclePhotoBucket', {
    bucketName: `fleet-photos-${scope.account}-${scope.region}`,
    versioned: true,
    encryption: s3.BucketEncryption.S3_MANAGED,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    cors: [
      {
        allowedMethods: [
          s3.HttpMethods.GET,
          s3.HttpMethods.PUT,
          s3.HttpMethods.POST,
          s3.HttpMethods.DELETE,
        ],
        allowedOrigins: ['*'], // Restrict in production
        allowedHeaders: ['*'],
        exposedHeaders: [
          'ETag',
          'x-amz-server-side-encryption',
          'x-amz-request-id',
          'x-amz-id-2',
        ],
        maxAge: 3000,
      },
    ],
    lifecycleRules: [
      {
        enabled: true,
        transitions: [
          {
            storageClass: s3.StorageClass.INFREQUENT_ACCESS,
            transitionAfter: cdk.Duration.days(90),
          },
          {
            storageClass: s3.StorageClass.GLACIER,
            transitionAfter: cdk.Duration.days(360),
          },
        ],
      },
    ],
  });

  return bucket;
};