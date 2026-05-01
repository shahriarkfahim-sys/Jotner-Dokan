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
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: number;
}
