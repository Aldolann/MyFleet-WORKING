import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
  },
  Storage: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    bucket: import.meta.env.VITE_AWS_STORAGE_BUCKET,
  },
  API: {
    endpoints: [
      {
        name: 'fleetApi',
        endpoint: import.meta.env.VITE_AWS_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      },
    ],
  },
};

Amplify.configure(awsConfig);

export default awsConfig;