import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Landmark, Truck } from 'lucide-react';

export default function Checkout({ id }: { id?: string }) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    paymentMethod: 'credit-card'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should be handled by protected route ideally

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items,
        totalAmount: total,
        status: 'pending',
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        createdAt: Date.now(),
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      navigate('/profile'); // Redirect to profile to see order tracking
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id} className="pt-32 pb-20 bg-brand-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h1 className="text-4xl font-serif text-brand-olive mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white p-8 rounded-[32px] border border-brand-sand shadow-sm">
                <h2 className="text-xl font-serif text-brand-olive mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-brand-clay" />
                  <span>Shipping Address</span>
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    type="text" 
                    placeholder="Street Address" 
                    required
                    className="w-full bg-brand-cream/30 border border-brand-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="City" 
                      required
                      className="bg-brand-cream/30 border border-brand-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <input 
                      type="text" 
                      placeholder="State / Province" 
                      required
                      className="bg-brand-cream/30 border border-brand-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="ZIP / Postal Code" 
                      required
                      className="bg-brand-cream/30 border border-brand-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                    <select 
                      className="bg-brand-cream/30 border border-brand-sand/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-olive"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[32px] border border-brand-sand shadow-sm">
                <h2 className="text-xl font-serif text-brand-olive mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-brand-clay" />
                  <span>Payment Method</span>
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'credit-card' ? 'border-brand-olive bg-brand-olive/5' : 'border-brand-sand'}`}>
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'credit-card' })}
                      className="accent-brand-olive"
                    />
                  </label>
                  <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'bank' ? 'border-brand-olive bg-brand-olive/5' : 'border-brand-sand'}`}>
                    <div className="flex items-center gap-3">
                      <Landmark size={20} />
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={formData.paymentMethod === 'bank'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                      className="accent-brand-olive"
                    />
                  </label>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading || items.length === 0}
                className="w-full btn-olive py-4 text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-brand-sand sticky top-32">
              <h2 className="text-2xl font-serif text-brand-olive mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-lg bg-brand-sand overflow-hidden shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-brand-olive">{item.name}</p>
                      <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-serif font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-brand-sand space-y-4">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-serif text-brand-olive">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-brand-sand/30 rounded-2xl text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-normal">
                <ShieldCheck size={24} className="text-brand-olive shrink-0" />
                <p>Your payment information is encrypted and secured by our enterprise payment gateway.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
