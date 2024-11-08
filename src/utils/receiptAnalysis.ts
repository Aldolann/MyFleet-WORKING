// Mock receipt analysis service
// In production, this would use AWS Textract or similar OCR service

interface ReceiptAnalysis {
  liters: number;
  totalCost: number;
  date?: string;
  station?: string;
}

export async function analyzeFuelReceipt(file: File): Promise<ReceiptAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock analysis result
  // In production, this would use AWS Textract to extract text and analyze the receipt
  return {
    liters: 45.5 + Math.random() * 10,
    totalCost: 89.99 + Math.random() * 20,
    date: new Date().toISOString().split('T')[0],
    station: 'Mock Gas Station',
  };
}