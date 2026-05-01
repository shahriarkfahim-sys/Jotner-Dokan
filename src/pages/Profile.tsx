import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Order, Product } from '../types';
import { CheckCircle2, Package, Heart, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';

const formatTk = (amount: number) => `Tk ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Profile({ id }: { id?: string }) {
  const { user, profile, logout, signIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [loading, setLoading] = useState(true);
  const [orderNotice, setOrderNotice] = useState<{ id: string; trackingNumber: string } | null>(null);

  useEffect(() => {
    const notice = sessionStorage.getItem('lastOrderNotification');
    if (notice) {
      setOrderNotice(JSON.parse(notice));
      sessionStorage.removeItem('lastOrderNotification');
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        // Load orders
        const ordersRef = collection(db, 'orders');
        const qOrders = query(ordersRef, where('userId', '==', user?.uid), orderBy('createdAt', 'desc'));
        const ordersSnap = await getDocs(qOrders);
        setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));

        // Load wishlist
        const wishlistRef = collection(db, 'wishlists');
        const qWishlist = query(wishlistRef, where('userId', '==', user?.uid));
        const wishlistSnap = await getDocs(qWishlist);
        const productIds = wishlistSnap.docs.map(d => d.data().productId);

        if (productIds.length > 0) {
          const productsRef = collection(db, 'products');
          // Firestore 'in' query has a limit of 10
          const productsSnap = await getDocs(productsRef);
          setWishlistProducts(productsSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => productIds.includes(p.id))
          );
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'user_data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (!user && !loading) {
    return (
      <div id={id} className="pt-40 pb-20 text-center px-4 bg-brand-bg min-h-screen">
        <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <UserIcon size={32} className="text-brand-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Welcome Back</h2>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed">
            Sign in to access your curated wishlist, track artisan crafts, and manage your personal collection.
          </p>
          <button onClick={signIn} className="btn-olive w-full py-4 text-sm font-bold shadow-xl shadow-brand-primary/20">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="pt-40 text-center font-sans font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Curating your experience...</div>;

  return (
    <div id={id} className="pt-32 pb-20 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-64 space-y-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden border-2 border-white shadow-md">
                <img src={user?.photoURL || ''} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-bold text-slate-900">{user?.displayName}</h3>
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">
                {profile?.role || 'Valued'} Member
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-brand-primary/20'}`}
            >
              <div className="flex items-center gap-3">
                <Package size={18} strokeWidth={activeTab === 'orders' ? 2.5 : 1.5} />
                <span className="text-sm font-bold">My Orders</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'wishlist' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-brand-primary/20'}`}
            >
              <div className="flex items-center gap-3">
                <Heart size={18} strokeWidth={activeTab === 'wishlist' ? 2.5 : 1.5} />
                <span className="text-sm font-bold">Wishlist</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-brand-primary/20'}`}
            >
              <div className="flex items-center gap-3">
                <UserIcon size={18} strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} />
                <span className="text-sm font-bold">Profile Details</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 border border-red-100 hover:bg-red-50 transition-all mt-8"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </aside>

          {/* Content */}
          <main className="flex-grow">
            {orderNotice && (
              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
                <CheckCircle2 size={24} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Your order is complete.</p>
                  <p className="text-sm">Tracking number: {orderNotice.trackingNumber}. You can follow the order condition below.</p>
                </div>
              </div>
            )}
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-serif text-brand-olive mb-8">Order History</h2>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-brand-sand flex flex-col md:flex-row gap-8">
                        <div className="flex-grow">
                          <div className="flex flex-wrap gap-4 mb-4">
                            <span className="px-4 py-1 bg-brand-sand/50 text-brand-olive text-[10px] font-bold uppercase tracking-widest rounded-full">
                              Order #{order.id.substring(0, 8)}
                            </span>
                            <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-400 mb-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          {order.trackingNumber && (
                            <p className="text-sm font-bold text-brand-olive mb-4">Tracking: {order.trackingNumber}</p>
                          )}
                          <div className="flex gap-2">
                             {order.items.map((item, idx) => (
                               <div key={idx} className="w-12 h-12 rounded-lg bg-brand-sand overflow-hidden border border-brand-sand">
                                 <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                               </div>
                             ))}
                          </div>
                          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
                            {(order.timeline || [
                              { label: 'Order placed', complete: true },
                              { label: 'Payment review', complete: order.paymentStatus === 'paid' || order.paymentMethod === 'cash-on-delivery' },
                              { label: 'Processing', complete: ['processing', 'shipped', 'delivered'].includes(order.status) },
                              { label: 'Shipped', complete: ['shipped', 'delivered'].includes(order.status) },
                              { label: 'Delivered', complete: order.status === 'delivered' },
                            ]).map((step, idx) => (
                              <div key={`${order.id}-${idx}`} className="flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${step.complete ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step.complete ? 'text-brand-olive' : 'text-slate-400'}`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="md:text-right flex flex-col justify-between">
                           <div>
                             <div className="text-2xl font-serif text-brand-olive">{formatTk(order.totalAmount)}</div>
                             <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                               {order.paymentMethod === 'bkash' ? 'bKash' : 'Cash on Delivery'}
                             </p>
                             <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                               Payment: {order.paymentStatus || 'pending'}
                             </p>
                           </div>
                           <button className="text-xs text-brand-clay font-bold underline hover:text-brand-olive transition-colors mt-4">Order Details</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-brand-sand italic text-neutral-400">
                      You haven't placed any orders yet.
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div 
                   key="wishlist"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-3xl font-serif text-brand-olive mb-8">My Wishlist</h2>
                  {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {wishlistProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-brand-sand italic text-neutral-400">
                      Your wishlist is empty. Start saving your favorite crafts!
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div 
                   key="profile"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                >
                  <h2 className="text-3xl font-serif text-brand-olive mb-8">Profile Details</h2>
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-brand-sand grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">Display Name</label>
                      <p className="text-lg text-brand-olive">{user?.displayName}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">Email Address</label>
                      <p className="text-lg text-brand-olive">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">Loyalty Points</label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif text-brand-clay">{profile?.loyaltyPoints || 0}</span>
                        <span className="text-xs text-neutral-500">Points available</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">Member Since</label>
                      <p className="text-lg text-brand-olive">{new Date(profile?.createdAt || 0).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
