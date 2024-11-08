import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import awsConfig from '../config/aws-config';

// Authentication
export const signIn = async (email: string, password: string) => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// API Calls
export const getFleetData = async () => {
  try {
    const response = await API.get('fleetApi', '/fleet', {});
    return response;
  } catch (error) {
    console.error('Error fetching fleet data:', error);
    throw error;
  }
};

export const getVehicles = async () => {
  try {
    const response = await API.get('fleetApi', '/vehicles', {});
    return response;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const createVehicle = async (vehicleData: any) => {
  try {
    const response = await API.post('fleetApi', '/vehicles', {
      body: vehicleData,
    });
    return response;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

// S3 Photo Upload
export const uploadPhoto = async (file: File, key: string) => {
  try {
    const s3Client = new S3Client({
      region: awsConfig.Storage.region,
      credentials: await Auth.currentCredentials(),
    });

    const command = new PutObjectCommand({
      Bucket: awsConfig.Storage.bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${awsConfig.Storage.bucket}.s3.${awsConfig.Storage.region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};