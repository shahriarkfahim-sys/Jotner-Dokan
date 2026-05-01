import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, orderBy, query, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Product, Order } from '../types';
import { Plus, LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { seedDemoData } from '../lib/seedData';

export default function Admin({ id }: { id?: string }) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // New Product State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Home Decor',
    stock: 10,
    imageUrl: ''
  });

  const isDev = user?.email === 'shahriar.fahim@brac.net';

  const handleSeed = async () => {
    if (!window.confirm('This will replace all existing products and artisans. Continue?')) return;
    setIsSeeding(true);
    try {
      await seedDemoData();
      window.location.reload(); 
    } catch (err: any) {
      console.error('Seed error:', err);
      alert(`Seed failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (!user || (!isDev && profile?.role !== 'admin' && profile?.role !== 'artisan')) {
       setLoading(false);
       return;
    }

    async function load() {
      try {
        const prodSnap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
        setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));

        const orderSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admin_data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, profile]);

  if (!user || (!isDev && profile?.role !== 'admin' && profile?.role !== 'artisan')) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-3xl font-serif text-brand-olive mb-4">Unauthorized Access</h2>
        <p className="text-neutral-500">This area is reserved for artisans and administrators.</p>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        artisanId: user.uid,
        images: [newProduct.imageUrl || 'https://images.unsplash.com/photo-1590422443890-271577708123?auto=format&fit=crop&w=800'],
        rating: 5,
        reviewCount: 0,
        createdAt: Date.now(),
        isFeatured: false,
        tags: [newProduct.category.toLowerCase()]
      };
      const docRef = await addDoc(collection(db, 'products'), productData);
      setProducts([{ id: docRef.id, ...productData } as Product, ...products]);
      setShowAddProduct(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  return (
    <div id={id} className="pt-24 min-h-screen bg-brand-cream lg:flex">
      {/* Admin Sidebar */}
      <aside className="lg:w-64 bg-brand-olive text-white p-8 lg:fixed lg:h-full">
        <div className="mb-12">
          <h2 className="font-serif text-2xl mb-1">Admin Panel</h2>
          <p className="text-[10px] uppercase tracking-widest text-brand-sand opacity-70">Inventory & Management</p>
        </div>

        <nav className="space-y-2">
          <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-brand-olive shadow-lg' : 'hover:bg-white/10'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Overview</span>
          </button>
          <button 
             onClick={() => setActiveTab('inventory')}
             className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'inventory' ? 'bg-white text-brand-olive shadow-lg' : 'hover:bg-white/10'}`}
          >
            <Package size={20} />
            <span className="font-bold text-sm">Inventory</span>
          </button>
          <button 
             onClick={() => setActiveTab('orders')}
             className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-white text-brand-olive shadow-lg' : 'hover:bg-white/10'}`}
          >
            <ShoppingBag size={20} />
            <span className="font-bold text-sm">Shipments</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-8 lg:p-12">
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-serif text-brand-olive mb-2">Welcome Back, {user.displayName}</h1>
                <p className="text-neutral-500">Here's how your artisan community is doing today.</p>
              </div>
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="btn-outline flex items-center gap-2 text-xs py-2 disabled:opacity-50"
              >
                <Database size={14} />
                <span>{isSeeding ? 'Seeding...' : 'Seed 30 Demo Products'}</span>
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-brand-sand">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Revenue</p>
                <p className="text-4xl font-serif text-brand-olive">${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-brand-sand">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Active Crafts</p>
                <p className="text-4xl font-serif text-brand-olive">{products.length}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-brand-sand">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Pending Orders</p>
                <p className="text-4xl font-serif text-brand-clay">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>

            <section className="bg-white rounded-[40px] p-8 border border-brand-sand">
              <h2 className="text-2xl font-serif text-brand-olive mb-8">Performance Analytics</h2>
              <div className="h-64 flex items-end gap-2 px-4 pb-4 border-b border-l border-brand-sand">
                 {[40, 60, 30, 80, 50, 90, 75].map((h, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     className="flex-grow bg-brand-olive/20 rounded-t-lg hover:bg-brand-clay transition-colors"
                   />
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] px-4">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif text-brand-olive">Manage Inventory</h2>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="btn-olive flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Add New Craft</span>
              </button>
            </div>

            {showAddProduct && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[32px] border-2 border-brand-olive shadow-xl"
              >
                <h3 className="text-xl font-serif mb-6">Create New Listing</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Product Name" 
                      className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <textarea 
                      placeholder="Description" 
                      className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive min-h-[100px]"
                      required
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="number" 
                        placeholder="Price" 
                        className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                        required
                        value={newProduct.price || ''}
                        onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      />
                      <input 
                        type="number" 
                        placeholder="Stock" 
                        className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                        required
                        value={newProduct.stock || ''}
                        onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      />
                    </div>
                      <select 
                        className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option>Home Decor</option>
                        <option>Jewelry</option>
                        <option>Daily Me</option>
                      </select>
                    <input 
                      type="url" 
                      placeholder="Image URL (Unsplash recommended)" 
                      className="w-full bg-brand-cream/30 border border-brand-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      value={newProduct.imageUrl}
                      onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddProduct(false)} className="px-6 py-2 text-neutral-500 hover:text-brand-olive transition-colors font-bold uppercase tracking-widest text-xs">Cancel</button>
                    <button type="submit" className="btn-olive px-10">Deploy Listing</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="bg-white rounded-[32px] overflow-hidden border border-brand-sand">
              <table className="w-full text-left">
                <thead className="bg-brand-sand/30 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  <tr>
                    <th className="px-8 py-4">Craft</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Stock</th>
                    <th className="px-8 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sand">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-brand-cream/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-brand-sand overflow-hidden">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-serif text-brand-olive">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-neutral-500">{product.category}</td>
                      <td className="px-8 py-4 font-serif font-bold">${product.price}</td>
                      <td className="px-8 py-4 text-sm">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                           {product.stock} units
                         </span>
                      </td>
                      <td className="px-8 py-4">
                        <button className="text-xs text-brand-clay font-bold underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-brand-olive text-center mb-8 pr-[300px]">Order Fulfilment</h2>
            <div className="space-y-4">
               {orders.map(order => (
                 <div key={order.id} className="bg-white p-8 rounded-[32px] border border-brand-sand flex flex-col md:flex-row gap-8 items-center">
                    <div className="shrink-0 flex -space-x-4">
                       {order.items.slice(0, 3).map((item, i) => (
                         <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-brand-sand overflow-hidden shadow-md">
                           <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                         </div>
                       ))}
                    </div>
                    <div className="flex-grow">
                       <h4 className="font-serif text-lg text-brand-olive">Order #{order.id.substring(0, 8)}</h4>
                       <p className="text-xs text-neutral-400">Customer ID: {order.userId.substring(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-xl font-serif font-bold text-brand-clay">${order.totalAmount.toFixed(2)}</div>
                    <div className="flex gap-2">
                       {['pending', 'processing', 'shipped', 'delivered'].map(status => (
                         <button 
                           key={status}
                           onClick={() => updateOrderStatus(order.id, status as any)}
                           className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${order.status === status ? 'bg-brand-olive text-white shadow-md' : 'bg-brand-sand/50 text-neutral-500 hover:bg-brand-sand'}`}
                         >
                           {status}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
