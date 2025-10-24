// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  imageUrl: string;
  videoUrl?: string;
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  properties: {
    color: string;
    clarity: string;
    cut: string;
    carat: number;
    treatment: string;
    origin: string;
    hardness: number;
    refractiveIndex: number;
    specificGravity: number;
  };
  certification?: {
    type: string;
    number: string;
    issuer: string;
    date: string;
  };
  tags: string[];
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address: Address;
  preferences: {
    newsletter: boolean;
    sms: boolean;
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  registrationDate: string;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  state?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  lastActivity?: string;
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  folder: string;
  tags: string[];
  alt?: string;
  caption?: string;
}

// Design Types
export interface DesignSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  logo: string;
  favicon: string;
  heroBackground: string;
  footerBackground: string;
  customCSS: string;
}

// Email Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'contact' | 'order' | 'newsletter' | 'welcome';
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  adminEmail: string;
}

// Audit Types
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'warning';
}

// System Types
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  language: string;
  currency: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  analyticsEnabled: boolean;
  backupEnabled: boolean;
  securityLogs: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  apiKey: string;
  webhookUrl: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
  consent: boolean;
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
