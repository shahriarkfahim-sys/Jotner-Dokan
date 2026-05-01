import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist({ id }: { id?: string }) {
  const { user, signIn } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadWishlist() {
      try {
        const wishlistRef = collection(db, 'wishlists');
        const q = query(wishlistRef, where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const productIds = snap.docs.map(d => d.data().productId);

        if (productIds.length > 0) {
          const productsRef = collection(db, 'products');
          const productsSnap = await getDocs(productsRef);
          setWishlistProducts(productsSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => productIds.includes(p.id))
          );
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'wishlists');
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  if (!user && !loading) {
    return (
      <div id={id} className="pt-40 pb-20 text-center bg-brand-cream min-h-screen">
        <div className="max-w-md mx-auto bg-white p-12 rounded-[40px] shadow-sm border border-brand-sand">
          <Heart size={48} className="mx-auto mb-6 text-brand-clay" />
          <h2 className="text-3xl font-serif text-brand-olive mb-4">Your Wishlist</h2>
          <p className="text-neutral-500 mb-8">Sign in to save your favorite handmade crafts and find them later.</p>
          <button onClick={signIn} className="btn-olive w-full py-4 text-lg">Sign In with Google</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="pt-40 text-center font-serif text-2xl animate-pulse">Loading your favorites...</div>;

  return (
    <div id={id} className="pt-32 pb-20 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-5xl font-serif text-brand-olive">Saved <span className="serif-italic text-brand-clay">Crafts</span></h1>
          <p className="text-neutral-500 mt-2">A collection of your favorite artisan creations.</p>
        </header>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[64px] border border-brand-sand shadow-inner">
             <div className="max-w-md mx-auto">
               <Heart size={40} className="mx-auto mb-6 text-brand-sand" />
               <h3 className="text-2xl font-serif text-brand-olive mb-4">No favorites yet</h3>
               <p className="text-neutral-500 mb-8">Explore our shop and save pieces that speak to you.</p>
               <Link to="/shop" className="btn-olive inline-block px-12 py-4">Explore Shop</Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
