import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, ShieldCheck, Truck } from 'lucide-react';

const SHIPPING_FEE = 100;
const VAT_RATE = 0.1;
const formatTk = (amount: number) => `Tk ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const LOCAL_ORDERS_KEY = 'jotnerLocalOrders';

function getLocalCustomerId() {
  const existing = localStorage.getItem('jotnerLocalCustomerId');
  if (existing) return existing;
  const id = `guest-${Date.now()}`;
  localStorage.setItem('jotnerLocalCustomerId', id);
  return id;
}

function saveLocalOrder(order: any) {
  const saved = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...saved]));
}

export default function Checkout({ id }: { id?: string }) {
  const { items, total, clearCart } = useCart();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    mobile: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
    sameBillingAddress: true,
    deliveryInstructions: '',
    paymentMethod: 'cash-on-delivery' as 'cash-on-delivery' | 'bkash',
    bkashNumber: '',
    transactionId: '',
  });

  const vat = useMemo(() => total * VAT_RATE, [total]);
  const grandTotal = useMemo(() => total + SHIPPING_FEE + vat, [total, vat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const createdAt = Date.now();
      const localId = `local-${createdAt}`;
      const orderData = {
        id: localId,
        userId: user?.uid || getLocalCustomerId(),
        items,
        subtotal: total,
        shippingFee: SHIPPING_FEE,
        vat,
        totalAmount: grandTotal,
        status: 'confirmed',
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'bkash' ? 'submitted' : 'pending',
        paymentDetails: formData.paymentMethod === 'bkash' ? {
          bkashNumber: formData.bkashNumber,
          transactionId: formData.transactionId,
        } : {},
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobile: formData.mobile,
        },
        shippingAddress: {
          street: formData.street,
          street2: formData.street2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        deliveryInstructions: formData.deliveryInstructions,
        trackingNumber: `JD-${createdAt.toString().slice(-8)}`,
        timeline: [
          { label: 'Order placed', timestamp: createdAt, complete: true },
          { label: 'Payment review', timestamp: createdAt, complete: formData.paymentMethod === 'cash-on-delivery' },
          { label: 'Processing', timestamp: createdAt, complete: false },
          { label: 'Shipped', timestamp: createdAt, complete: false },
          { label: 'Delivered', timestamp: createdAt, complete: false },
        ],
        createdAt,
      };
      
      let savedOrderId = localId;
      try {
        if (user) {
          const orderRef = await addDoc(collection(db, 'orders'), orderData);
          savedOrderId = orderRef.id;
          await addDoc(collection(db, 'notifications'), {
            userId: user.uid,
            orderId: orderRef.id,
            title: 'Order confirmed',
            message: `Your Jotner Dokan order ${orderData.trackingNumber} has been placed successfully.`,
            read: false,
            createdAt,
          });
        } else {
          saveLocalOrder(orderData);
        }
      } catch (error) {
        console.warn('Saving order locally because Firebase is not available on this host:', error);
        saveLocalOrder(orderData);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Jotner Dokan order confirmed', {
          body: `Tracking number: ${orderData.trackingNumber}`,
        });
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      sessionStorage.setItem('lastOrderNotification', JSON.stringify({
        id: savedOrderId,
        trackingNumber: orderData.trackingNumber,
      }));
      setOrderComplete(savedOrderId);
      clearCart();
      setTimeout(() => navigate('/profile'), 1200);
    } catch (error) {
      console.error('Order could not be completed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div id={id} className="pt-40 pb-20 text-center bg-brand-cream min-h-screen px-4">
        <div className="max-w-md mx-auto bg-white p-10 border border-brand-sand">
          <h1 className="text-3xl font-black text-slate-950 mb-4">Your bag is empty</h1>
          <p className="text-slate-500 mb-8">Add products before starting checkout.</p>
          <Link to="/shop" className="btn-olive block py-4">Shop Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orderComplete && (
          <div className="mb-8 flex items-center gap-3 border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle2 size={22} />
            <p className="font-bold">Order completed. Your confirmation is saved in your account.</p>
          </div>
        )}

        {!user && (
          <div className="mb-8 flex flex-col gap-3 border border-brand-sand bg-brand-cream p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bold text-brand-olive">Local checkout is enabled. Sign in is optional for testing; signed-in orders sync to your account.</p>
            <button onClick={signIn} className="bg-black px-8 py-3 text-sm font-black uppercase tracking-widest text-white">
              Sign In with Google
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10">
          <div className="space-y-8">
            <section className="border border-slate-100 shadow-lg shadow-slate-100">
              <div className="flex items-center gap-5 bg-[#444] px-7 py-5 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-[#444]">1</span>
                <h2 className="text-xl font-black uppercase tracking-wide">Shipping Address</h2>
              </div>
              <div className="space-y-6 p-7">
                <div>
                  <label className="mb-2 block font-black">Email Address <span className="text-brand-primary">*</span></label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  <p className="mt-2 text-sm text-slate-500">You can create an account after checkout.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-200 pt-6">
                  <div>
                    <label className="mb-2 block font-black">First Name <span className="text-brand-primary">*</span></label>
                    <input required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="mb-2 block font-black">Last Name <span className="text-brand-primary">*</span></label>
                    <input required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-black">Mobile Number <span className="text-brand-primary">*</span></label>
                  <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="mb-2 block font-black">Street Address <span className="text-brand-primary">*</span></label>
                  <input required value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="mb-4 h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  <input value={formData.street2} onChange={(e) => setFormData({ ...formData, street2: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-2 block font-black">Country <span className="text-brand-primary">*</span></label>
                    <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary">
                      <option>Bangladesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-black">District/State <span className="text-brand-primary">*</span></label>
                    <select required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary">
                      <option value="">Select a region, state or province.</option>
                      <option>Dhaka</option>
                      <option>Chattogram</option>
                      <option>Rajshahi</option>
                      <option>Khulna</option>
                      <option>Sylhet</option>
                      <option>Barishal</option>
                      <option>Rangpur</option>
                      <option>Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block font-black">City/Area <span className="text-brand-primary">*</span></label>
                    <input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="mb-2 block font-black">Zip/Postal Code <span className="text-brand-primary">*</span></label>
                    <input required value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="h-14 w-full border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <label className="flex items-center gap-3 pt-2 text-slate-500">
                  <input type="checkbox" checked={formData.sameBillingAddress} onChange={(e) => setFormData({ ...formData, sameBillingAddress: e.target.checked })} className="h-5 w-5 accent-black" />
                  My billing and shipping address are the same
                </label>
              </div>
            </section>

            <section className="border border-slate-100 shadow-lg shadow-slate-100">
              <div className="flex items-center gap-5 bg-[#444] px-7 py-5 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-[#444]">2</span>
                <h2 className="text-xl font-black uppercase tracking-wide">Shipping Method</h2>
              </div>
              <div className="p-7">
                <label className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-4 font-medium">
                    <input type="radio" checked readOnly className="h-5 w-5 accent-black" />
                    Standard Shipping
                  </span>
                  <span className="text-slate-700">within 3-4 days inside Dhaka and 4-7 days outside Dhaka</span>
                  <span className="font-bold">{formatTk(SHIPPING_FEE)}</span>
                </label>
                <label className="mt-6 block underline underline-offset-4">
                  Add Instructions for Delivery
                </label>
                <textarea value={formData.deliveryInstructions} onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })} className="mt-3 h-24 w-full border border-slate-300 p-4 outline-none focus:border-brand-primary" />
              </div>
            </section>

            <section className="border border-slate-100 shadow-lg shadow-slate-100">
              <div className="flex items-center gap-5 bg-[#444] px-7 py-5 text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-[#444]">3</span>
                <h2 className="text-xl font-black uppercase tracking-wide">Payment Method</h2>
              </div>
              <div className="space-y-4 p-7">
                <label className="flex items-center gap-4 text-lg text-slate-500">
                  <input type="radio" name="payment" checked={formData.paymentMethod === 'bkash'} onChange={() => setFormData({ ...formData, paymentMethod: 'bkash' })} className="h-6 w-6 accent-black" />
                  <CreditCard size={18} />
                  bKash
                </label>
                {formData.paymentMethod === 'bkash' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-10">
                    <input required placeholder="bKash mobile number" value={formData.bkashNumber} onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })} className="h-12 border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                    <input required placeholder="Transaction ID" value={formData.transactionId} onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })} className="h-12 border border-slate-300 px-4 outline-none focus:border-brand-primary" />
                  </div>
                )}
                <label className="flex items-center gap-4 text-lg text-slate-500">
                  <input type="radio" name="payment" checked={formData.paymentMethod === 'cash-on-delivery'} onChange={() => setFormData({ ...formData, paymentMethod: 'cash-on-delivery' })} className="h-6 w-6 accent-black" />
                  <Truck size={18} />
                  Cash on Delivery
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 self-start border border-slate-100 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-5 bg-[#444] px-7 py-5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-[#444]">4</span>
              <h2 className="text-xl font-black uppercase tracking-wide">Order Review</h2>
            </div>
            <div className="p-6">
              <div className="mb-5 flex justify-between border-b border-slate-300 pb-3 font-black uppercase text-slate-500">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <div className="divide-y divide-slate-200">
                {items.map(item => (
                  <div key={item.cartKey} className="grid grid-cols-[74px_1fr_auto] gap-4 py-5">
                    <div className="aspect-[4/5] bg-brand-sand overflow-hidden">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black leading-snug text-slate-950">{item.name}</p>
                      <p className="mt-2 text-sm text-slate-500">Size: {item.size}</p>
                      <p className="mt-2 text-sm text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-black text-slate-950">{formatTk(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4 border-t border-slate-300 pt-4">
                <div className="flex justify-between font-black text-slate-500">
                  <span>SUBTOTAL</span>
                  <span className="text-slate-950">{formatTk(total)}</span>
                </div>
                <div className="flex justify-between gap-6 border-t border-slate-200 pt-4 font-black text-slate-500">
                  <span>SHIPPING <span className="block pt-2 text-sm normal-case font-bold">Standard Shipping: within 3-4 days inside Dhaka and 4-7 days outside Dhaka</span></span>
                  <span className="text-slate-950">{formatTk(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 font-black text-slate-500">
                  <span>VAT</span>
                  <span className="text-slate-950">{formatTk(vat)}</span>
                </div>
                <div className="flex justify-between bg-slate-100 p-4 text-xl font-black">
                  <span>TOTAL</span>
                  <span className="text-brand-primary">{formatTk(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-8 text-sm leading-relaxed text-slate-950">
                <p className="mb-3 font-black underline">Checkout Disclaimers:</p>
                <p>1. Your order may arrive in multiple shipments depending on stock and artisan availability.</p>
                <p>2. For Cash on Delivery orders, make payment only after receiving the product.</p>
                <p>3. By clicking Place Order, you agree to Jotner Dokan's terms and delivery policy.</p>
              </div>

              <button type="submit" disabled={loading || items.length === 0} className="mt-8 w-full bg-black py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-secondary disabled:opacity-50">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <div className="mt-5 flex items-center gap-3 bg-brand-cream p-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <ShieldCheck size={24} className="text-brand-olive shrink-0" />
                <p>Order confirmation and tracking will be saved to your account.</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
