import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, BarChart2, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/ComparisonContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export default function ProductCard({ product }: { product: Product, key?: React.Key }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToCompare } = useCompare();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [artisanName, setArtisanName] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const wishlistId = `${user.uid}_${product.id}`;
          const docRef = doc(db, 'wishlists', wishlistId);
          const snap = await getDoc(docRef);
          setIsWishlisted(snap.exists());
        }

        if (product.artisanId) {
          const artisanSnap = await getDoc(doc(db, 'artisans', product.artisanId));
          if (artisanSnap.exists()) {
            setArtisanName(artisanSnap.data().name);
          }
        }
      } catch (error) {
        console.warn('Skipping product metadata lookup:', error);
      }
    }
    load();
  }, [user, product.id, product.artisanId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const wishlistId = `${user.uid}_${product.id}`;
    const docRef = doc(db, 'wishlists', wishlistId);

    try {
      if (isWishlisted) {
        await deleteDoc(docRef);
        setIsWishlisted(false);
      } else {
        await setDoc(docRef, {
          userId: user.uid,
          productId: product.id,
          addedAt: Date.now(),
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wishlists/${wishlistId}`);
    }
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-slate-100 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
             {product.stock > 0 && product.rating >= 4.5 && (
               <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight shadow-sm text-slate-900">
                 Best Seller
               </span>
             )}
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={toggleWishlist}
              className={`p-2 rounded-full bg-white shadow-sm border border-slate-100 transition-all ${
                isWishlisted ? 'text-brand-primary' : 'text-slate-400 hover:text-brand-primary'
              }`}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCompare(product); }}
              className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-brand-primary transition-all"
            >
              <BarChart2 size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            {artisanName || product.category || 'ARTISAN'}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">{product.name}</h3>
          </Link>
        </div>
        <span className="font-bold text-slate-900">${product.price}</span>
      </div>
      
      <div className="mt-2 flex items-center gap-1">
        <div className="flex text-amber-400">
          <Star size={12} fill="currentColor" />
        </div>
        <span className="text-[10px] font-bold text-slate-400">({product.reviewCount || 0} reviews)</span>
      </div>
      
      <button 
        onClick={(e) => { e.preventDefault(); addToCart(product); }}
        className="mt-4 w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95"
      >
        Add to Bag
      </button>
    </div>
  );
}
