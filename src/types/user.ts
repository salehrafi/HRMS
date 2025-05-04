
export type UserType = 'admin' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Admin extends User {
  role: 'admin';
  password: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatId: string;
  loginCode: string;
}

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'bill' | 'maintenance' | 'message';
}
