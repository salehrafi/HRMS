import { Admin, Tenant, Notification } from "@/types/user";
import { Flat, MaintenanceRequest, Document, Payment } from "@/types/property";

export const adminData: Admin = {
  id: "admin-001",
  name: "Mr. X",
  email: "admin@hrms.com",
  phone: "+880 123-4567",
  role: "admin",
  password: "password"
};

export const tenantData: Tenant[] = [
  {
    id: "tenant-001",
    name: "Rafi",
    email: "rafi@hrms.com",
    phone: "+880 987-6543",
    flatId: "flat-001",
    loginCode: "123456",
  },
];

export const flatsData: Flat[] = [
  {
    id: "flat-001",
    name: "East Apartment",
    number: "101",
    floor: "1st",
    area: "950 sqft",
    rent: 1200,
    maintenanceCost: 100,
    serviceCharge: 50,
    elevatorFee: 25,
    securityCharge: 75,
    societyFee: 50,
    status: "booked",
    tenantId: "tenant-001",
    loginCode: "123456",
  },
  {
    id: "flat-002",
    name: "Ocean View West",
    number: "202",
    floor: "2nd",
    area: "1050 sqft",
    rent: 1500,
    maintenanceCost: 120,
    serviceCharge: 60,
    elevatorFee: 25,
    securityCharge: 75,
    societyFee: 50,
    status: "booked",
    tenantId: "tenant-002",
    loginCode: "654321",
  },
  {
    id: "flat-003",
    name: "City Heights",
    number: "303",
    floor: "3rd",
    area: "850 sqft",
    rent: 1100,
    maintenanceCost: 90,
    serviceCharge: 45,
    elevatorFee: 25,
    securityCharge: 60,
    societyFee: 40,
    status: "available",
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "maintenance-001",
    flatId: "flat-001",
    tenantId: "tenant-001",
    title: "Leaking Faucet",
    description: "The kitchen faucet is leaking and needs to be fixed.",
    status: "in_progress",
    createdAt: "2023-04-10T14:30:00Z",
    updatedAt: "2023-04-11T09:15:00Z",
  },
  {
    id: "maintenance-002",
    flatId: "flat-002",
    tenantId: "tenant-002",
    title: "AC Not Working",
    description: "The air conditioning unit in the living room is not cooling properly.",
    imageUrl: "https://images.unsplash.com/photo-1581275233365-afb02e5d39cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "received",
    createdAt: "2023-04-12T10:45:00Z",
    updatedAt: "2023-04-12T10:45:00Z",
  },
  {
    id: "maintenance-003",
    flatId: "flat-001",
    tenantId: "tenant-001",
    title: "Broken Light Fixture",
    description: "The ceiling light in the dining room is not working, might need replacement.",
    status: "done",
    createdAt: "2023-04-01T08:20:00Z",
    updatedAt: "2023-04-03T16:30:00Z",
  },
];

export const notifications: Notification[] = [
  {
    id: "notif-001",
    title: "Rent Due Reminder",
    message: "Your rent payment for May is due in 3 days.",
    date: "2023-04-27T09:00:00Z",
    read: false,
    type: "bill",
  },
  {
    id: "notif-002",
    title: "Maintenance Update",
    message: "Your maintenance request for 'Leaking Faucet' is now in progress.",
    date: "2023-04-11T09:15:00Z",
    read: true,
    type: "maintenance",
  },
  {
    id: "notif-003",
    title: "Building Notice",
    message: "Water supply will be interrupted on Sunday from 10am to 2pm due to maintenance work.",
    date: "2023-04-25T14:00:00Z",
    read: false,
    type: "message",
  },
  {
    id: "notif-003",
    title: "Building Notice",
    message: "Building is distroyed due to PAK-Indain Missail attack.",
    date: "2023-04-25T14:00:00Z",
    read: true,
    type: "message",
  },
];

export const documents: Document[] = [
  {
    id: "doc-001",
    name: "Rental Agreement",
    type: "PDF",
    url: "#",
    uploadedAt: "2023-01-15T11:30:00Z",
  },
  {
    id: "doc-002",
    name: "ID Proof",
    type: "JPEG",
    url: "#",
    uploadedAt: "2023-01-15T11:35:00Z",
  },
  {
    id: "doc-003",
    name: "Employment Verification",
    type: "PDF",
    url: "#",
    uploadedAt: "2023-01-16T09:45:00Z",
  },
];

export const payments: Payment[] = [
  {
    id: "payment-001",
    flatId: "flat-001",
    tenantId: "tenant-001",
    amount: 1500,
    date: "2023-04-02T10:30:00Z",
    method: "online",
    status: "paid",
    month: "April",
    year: "2023",
  },
  {
    id: "payment-002",
    flatId: "flat-001",
    tenantId: "tenant-001",
    amount: 1500,
    date: "2023-03-03T14:45:00Z",
    method: "cash",
    status: "paid",
    month: "March",
    year: "2023",
  },
  {
    id: "payment-003",
    flatId: "flat-001",
    tenantId: "tenant-001",
    amount: 1500,
    date: "",
    method: "online",
    status: "pending",
    month: "May",
    year: "2023",
  },
];
