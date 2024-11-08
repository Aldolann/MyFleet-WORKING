// Mock report service
// In production, this would be replaced with AWS API Gateway calls

interface Report {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  type: 'damage' | 'inspection';
  status: 'pending' | 'resolved';
  details: {
    severity?: 'low' | 'medium' | 'high';
    location?: string;
    notes?: string;
  };
}

export async function fetchReports(): Promise<Report[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data
  return [
    {
      id: '1',
      date: '2024-03-10',
      vehicleId: 'ABC-123',
      driverId: 'driver1',
      type: 'damage',
      status: 'pending',
      details: {
        severity: 'high',
        location: 'Front bumper',
        notes: 'Significant damage noticed during morning inspection',
      },
    },
    {
      id: '2',
      date: '2024-03-09',
      vehicleId: 'XYZ-789',
      driverId: 'driver2',
      type: 'inspection',
      status: 'resolved',
      details: {
        notes: 'Regular inspection completed, no issues found',
      },
    },
  ];
}

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'resolved'
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Report ${reportId} status updated to ${status}`);
}