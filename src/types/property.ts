
export type FlatStatus = 'available' | 'booked';
export type MaintenanceStatus = 'received' | 'in_progress' | 'done';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type PaymentMethod = 'online' | 'cash';

export interface Flat {
  id: string;
  name: string;
  number: string;
  floor: string;
  area: string;
  rent: number;
  maintenanceCost: number;
  serviceCharge: number;
  elevatorFee: number;
  securityCharge: number;
  societyFee: number;
  status: FlatStatus;
  tenantId?: string;
  loginCode?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  flatId: string;
  tenantId: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  flatId: string;
  tenantId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  month: string;
  year: string;
}
