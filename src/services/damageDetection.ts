import { API } from 'aws-amplify';

interface DamageAnalysis {
  hasDamage: boolean;
  confidence: number;
  damageType?: string;
  severity?: 'low' | 'medium' | 'high';
  labels: string[];
}

export const analyzePhoto = async (
  photoKey: string,
  inspectionId: string
): Promise<DamageAnalysis> => {
  try {
    const response = await API.post('fleetApi', '/analyze-photo', {
      body: {
        photoKey,
        inspectionId,
      },
    });

    return response.analysis;
  } catch (error) {
    console.error('Error analyzing photo:', error);
    throw new Error('Failed to analyze photo for damage');
  }
};