import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

export const productCollection = collection(db, 'products');

const fallbackProducts: Product[] = [
  {
    id: 'demo-tactile-wool-throw',
    name: 'Tactile Wool Throw',
    description: 'A beautifully textured throw blanket hand-woven with organic wool.',
    price: 120,
    category: 'Home Decor',
    tags: ['woven', 'wool', 'homedecor'],
    images: ['https://images.unsplash.com/photo-1580302202102-46179fbf0e68?auto=format&fit=crop&w=800'],
    stock: 5,
    artisanId: 'artisan_sarah',
    rating: 5,
    reviewCount: 12,
    isFeatured: true,
    createdAt: Date.now(),
  },
  {
    id: 'demo-minimalist-tea-set',
    name: 'Minimalist Tea Set',
    description: 'A 3-piece ceramic tea set with ergonomic handles and a matte glaze finish.',
    price: 85,
    category: 'Home Decor',
    tags: ['ceramics', 'kitchen', 'minimalist'],
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e17cb?auto=format&fit=crop&w=800'],
    stock: 10,
    artisanId: 'artisan_david',
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true,
    createdAt: Date.now() - 1000,
  },
  {
    id: 'demo-cedar-bowl',
    name: 'Hand-Carved Cedar Bowl',
    description: 'Sculpted from reclaimed cedar wood to highlight natural grain and warmth.',
    price: 65,
    category: 'Daily Me',
    tags: ['woodwork', 'nature', 'handcarved'],
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800'],
    stock: 3,
    artisanId: 'artisan_david',
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    createdAt: Date.now() - 2000,
  },
];

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  try {
    const q = query(productCollection, where('isFeatured', '==', true), limit(n));
    const snap = await getDocs(q);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products.length > 0 ? products : fallbackProducts.slice(0, n);
  } catch (error) {
    console.warn('Using demo featured products:', error);
    return fallbackProducts.slice(0, n);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(productCollection);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products.length > 0 ? products : fallbackProducts;
  } catch (error) {
    console.warn('Using demo products:', error);
    return fallbackProducts;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(productCollection, where('category', '==', category));
    const snap = await getDocs(q);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products.length > 0 ? products : fallbackProducts.filter(product => product.category === category);
  } catch (error) {
    console.warn(`Using demo products for category "${category}":`, error);
    return fallbackProducts.filter(product => product.category === category);
  }
}
