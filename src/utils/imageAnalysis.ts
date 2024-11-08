// Mock image analysis service
// In production, this would be replaced with AWS Rekognition

export interface DamageAnalysis {
  hasDamage: boolean;
  confidence: number;
  location?: string;
  severity?: 'low' | 'medium' | 'high';
}

export async function analyzeDamage(imageUrl: string): Promise<DamageAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate damage detection with higher probability (70%)
  const random = Math.random();
  if (random > 0.3) { // Changed from 0.7 to 0.3 to increase damage detection rate
    return {
      hasDamage: true,
      confidence: 0.85 + (Math.random() * 0.1),
      location: random > 0.6 ? 'front bumper' : random > 0.4 ? 'side panel' : 'rear bumper',
      severity: random > 0.8 ? 'high' : random > 0.5 ? 'medium' : 'low',
    };
  }

  return {
    hasDamage: false,
    confidence: 0.90 + (Math.random() * 0.1),
  };
}