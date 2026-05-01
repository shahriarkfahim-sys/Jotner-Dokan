import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const productCollection = collection(db, 'products');

const fallbackProducts: Product[] = [
  {
    id: 'jotner-moonlit-canvas',
    name: 'Moonlit Canvas Art',
    description: 'A hand-painted home decor piece from Jotner Dokan, created to turn artistic skill into income opportunity for persons with disabilities.',
    price: 45,
    category: 'Home Decor',
    tags: ['artwork', 'canvas', 'home decor', 'eco-friendly'],
    images: ['/assets/products/art-easel.jpg'],
    stock: 8,
    artisanId: 'jotner_collective',
    rating: 5,
    reviewCount: 31,
    isFeatured: true,
    createdAt: Date.now(),
  },
  {
    id: 'jotner-botanical-tote',
    name: 'Botanical Canvas Tote',
    description: 'A daily-use tote bag with hand-drawn botanical motifs, made for customers who want practical design with a clear social purpose.',
    price: 25,
    category: 'Daily Use',
    tags: ['tote bag', 'daily use', 'lifestyle', 'handmade'],
    images: ['/assets/products/botanical-tote.jpg'],
    stock: 14,
    artisanId: 'jotner_collective',
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    createdAt: Date.now() - 1000,
  },
  {
    id: 'jotner-wild-soul-tote',
    name: 'Wild Soul Tote',
    description: 'A statement tote designed for everyday carrying, part of Jotner Dokan\'s eco-friendly lifestyle product line.',
    price: 28,
    category: 'Daily Use',
    tags: ['tote bag', 'custom design', 'daily use', 'purpose-driven'],
    images: ['/assets/products/wild-soul-tote.jpg'],
    stock: 9,
    artisanId: 'jotner_collective',
    rating: 4.9,
    reviewCount: 37,
    isFeatured: true,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'jotner-flower-mug',
    name: 'Decorated Flower Mug',
    description: 'A hand-decorated mug that brings Jotner Dokan\'s artwork into daily routines and supports financial independence for disabled makers.',
    price: 18,
    category: 'Home Decor',
    tags: ['decorated mug', 'daily use', 'home decor', 'handmade'],
    images: ['/assets/products/flower-mug.jpg'],
    stock: 12,
    artisanId: 'jotner_collective',
    rating: 4.8,
    reviewCount: 26,
    isFeatured: true,
    createdAt: Date.now() - 3000,
  },
  {
    id: 'jotner-owl-shora',
    name: 'Owl Shora Canvas',
    description: 'A colorful shora canvas for art and aesthetic lovers, made through a market-driven social business model.',
    price: 35,
    category: 'Home Decor',
    tags: ['shora canvas', 'artwork', 'home decor', 'gift'],
    images: ['/assets/products/owl-shora.jpg'],
    stock: 7,
    artisanId: 'jotner_collective',
    rating: 5,
    reviewCount: 29,
    isFeatured: true,
    createdAt: Date.now() - 4000,
  },
];

function mergeWithFallback(products: Product[]) {
  const seen = new Set<string>();
  return [...fallbackProducts, ...products].filter(product => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  try {
    const q = query(productCollection, where('isFeatured', '==', true), limit(n));
    const snap = await getDocs(q);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return mergeWithFallback(products).slice(0, n);
  } catch (error) {
    console.warn('Using demo featured products:', error);
    return fallbackProducts.slice(0, n);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(productCollection);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return mergeWithFallback(products);
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
    return mergeWithFallback(products).filter(product => product.category === category);
  } catch (error) {
    console.warn(`Using demo products for category "${category}":`, error);
    return fallbackProducts.filter(product => product.category === category);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const localProduct = fallbackProducts.find(product => product.id === id);
  if (localProduct) return localProduct;

  try {
    const snap = await getDoc(doc(db, 'products', id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
  } catch (error) {
    console.warn(`Unable to load product "${id}":`, error);
    return null;
  }
}
