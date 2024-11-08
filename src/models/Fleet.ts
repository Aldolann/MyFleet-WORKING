export interface Fleet {
  id: string;
  name: string;
  adminId: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact?: {
    phone: string;
    email: string;
  };
  settings?: {
    timezone: string;
    language: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiresAt: string;
  };
  createdAt: string;
  updatedAt: string;
  ttl?: number;
}