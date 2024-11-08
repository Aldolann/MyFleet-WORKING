import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

const getS3Client = async () => {
  const credentials = await Auth.currentCredentials();
  return new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials,
  });
};

export const uploadPhoto = async (
  file: File,
  folder: string,
  vehicleId: string
): Promise<string> => {
  try {
    const s3Client = await getS3Client();
    const fileExtension = file.name.split('.').pop();
    const key = `${folder}/${vehicleId}/${uuidv4()}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_AWS_STORAGE_BUCKET,
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: {
        vehicleId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);
    
    return `https://${import.meta.env.VITE_AWS_STORAGE_BUCKET}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo');
  }
};

export const deletePhoto = async (photoUrl: string): Promise<void> => {
  try {
    const s3Client = await getS3Client();
    const key = photoUrl.split('.com/')[1];
    
    const command = new DeleteObjectCommand({
      Bucket: import.meta.env.VITE_AWS_STORAGE_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo');
  }
};

export const generatePhotoUrl = (key: string): string => {
  return `https://${import.meta.env.VITE_AWS_STORAGE_BUCKET}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/${key}`;
};