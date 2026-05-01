import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';

interface ComparisonContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isComparing: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      if (prev.length >= 4) return [...prev.slice(1), product];
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  return (
    <ComparisonContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isComparing: compareList.length > 0
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useCompare = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a ComparisonProvider');
  }
  return context;
};
