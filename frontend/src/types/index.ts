// API Response Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'technician';
}

export interface Lab {
  id: number;
  name: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface PC {
  id: number;
  lab: number;
  name: string;
  status: string;
  brand?: string;
  serial_number?: string;
}

export interface Equipment {
  id: number;
  lab: number;
  equipment_type: 'PC' | 'MONITOR' | 'KEYBOARD' | 'MOUSE' | 'ROUTER' | 'SWITCH' | 'SERVER' | 'FAN' | 'LIGHT' | 'OTHER';
  brand?: string;
  model_name?: string;
  serial_number?: string;
  location_in_lab?: string;
  price?: number;
  status: 'working' | 'not_working' | 'under_repair';
  added_on: string;
  updated_at: string;
}

export interface Software {
  id: number;
  pc: number;
  name: string;
  version?: string;
  license_key?: string;
  expiry_date?: string;
}

export interface MaintenanceLog {
  id: number;
  equipment: number;
  reported_by?: number;
  fixed_by?: number;
  issue_description?: string;
  status_before: 'working' | 'not_working' | 'under_repair';
  status_after?: 'working' | 'not_working' | 'under_repair';
  status: 'pending' | 'fixed';
  reported_on: string;
  fixed_on?: string;
  remarks?: string;
}

export interface Inventory {
  id: number;
  equipment_type: string;
  total_quantity: number;
  working_quantity: number;
  not_working_quantity: number;
  under_repair_quantity: number;
  lab: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'technician';
}

export interface AuthResponse {
  access: string;
  refresh: string;
}
