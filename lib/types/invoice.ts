// Invoice Types for Kleinunternehmer Rechnungssystem

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'OVERDUE' | 'CANCELLED';
export type InvoicePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface Customer {
  id: string;
  customerNumber: string;
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  order: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  invoiceDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  paymentStatus: InvoicePaymentStatus;
  paymentDate?: Date;
  subtotal: number;
  total: number;
  currency: string;
  notes?: string;
  internalNotes?: string;
  bankAccountId?: string;
  bankAccount?: BankAccount;
  reminderCount: number;
  lastReminderDate?: Date;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  iban: string;
  bic?: string;
  accountHolder: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  ownerName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  email: string;
  website?: string;
  taxId?: string;
  vatId?: string;
  logo?: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  smallBusinessNotice: string;
  paymentTerms: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper Types
export interface InvoiceFormData {
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  internalNotes?: string;
  bankAccountId?: string;
}

export interface CustomerFormData {
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  taxId?: string;
  notes?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  overdueInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  unpaidAmount: number;
  overdueAmount: number;
}


