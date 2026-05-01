import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

export const productCollection = collection(db, 'products');

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  try {
    const q = query(productCollection, where('isFeatured', '==', true), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(productCollection);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(productCollection, where('category', '==', category));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    return [];
  }
}
