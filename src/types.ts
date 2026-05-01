/**
 * InclusiveCrafts Types
 */

export enum UserRole {
  CUSTOMER = 'customer',
  ARTISAN = 'artisan',
  ADMIN = 'admin'
}

export interface ArtisanProfile {
  id: string;
  name: string;
  bio: string;
  story: string;
  avatarUrl: string;
  location: string;
  specialties: string[];
  disabilityInfo?: string; // Optional field for context if artisan chooses to share
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
}

export interface Product {
  id: string;
  artisanId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: number;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  artisanId: string;
  authorName: string;
  coverImage: string;
  createdAt: number;
  tags: string[];
}

export interface WishlistItem {
  productId: string;
  userId: string;
  addedAt: number;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  cartKey: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  subtotal?: number;
  shippingFee?: number;
  vat?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'cash-on-delivery' | 'bkash';
  paymentStatus?: 'pending' | 'submitted' | 'paid';
  paymentDetails?: {
    bkashNumber?: string;
    transactionId?: string;
  };
  customer?: {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
  };
  trackingNumber?: string;
  deliveryInstructions?: string;
  shippingAddress: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: number;
  timeline?: Array<{
    label: string;
    timestamp: number;
    complete: boolean;
  }>;
}
