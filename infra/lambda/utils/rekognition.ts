import { RekognitionClient, DetectLabelsCommand, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';

const rekognition = new RekognitionClient({});

export interface DamageAnalysis {
  hasDamage: boolean;
  confidence: number;
  damageType?: string;
  severity?: 'low' | 'medium' | 'high';
  labels: string[];
}

export const analyzeVehicleImage = async (
  bucket: string,
  key: string
): Promise<DamageAnalysis> => {
  try {
    // Detect labels in the image
    const detectLabelsCommand = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
      MinConfidence: 80,
      MaxLabels: 20,
    });

    const labelResponse = await rekognition.send(detectLabelsCommand);
    
    // Look for damage-related labels
    const damageLabels = labelResponse.Labels?.filter(label => 
      [
        'Scratch',
        'Dent',
        'Broken',
        'Damaged',
        'Rust',
        'Crack',
        'Collision',
        'Accident',
      ].includes(label.Name || '')
    ) || [];

    // Calculate damage severity based on confidence scores
    const avgConfidence = damageLabels.reduce((sum, label) => 
      sum + (label.Confidence || 0), 0) / (damageLabels.length || 1);

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (avgConfidence > 90) severity = 'high';
    else if (avgConfidence > 80) severity = 'medium';

    return {
      hasDamage: damageLabels.length > 0,
      confidence: avgConfidence,
      damageType: damageLabels[0]?.Name,
      severity,
      labels: labelResponse.Labels?.map(label => label.Name || '') || [],
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};