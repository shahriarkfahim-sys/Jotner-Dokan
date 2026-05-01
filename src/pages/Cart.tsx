import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const SIZE_OPTIONS = ['Standard', 'Small', 'Medium', 'Large'];
const SHIPPING_FEE = 100;
const VAT_RATE = 0.1;
const formatTk = (amount: number) => `Tk ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Cart({ id }: { id?: string }) {
  const { items, total, removeFromCart, updateQuantity, updateSize, itemCount } = useCart();
  const { user, signIn } = useAuth();
  const vat = total * VAT_RATE;
  const grandTotal = total + SHIPPING_FEE + vat;

  if (itemCount === 0) {
    return (
      <div id={id} className="pt-40 pb-20 text-center px-4 bg-brand-cream min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-brand-sand">
            <div className="w-20 h-20 bg-brand-sand rounded-full flex items-center justify-center mx-auto mb-6 text-brand-olive">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-3xl font-serif text-brand-olive mb-4">Your bag is empty</h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Looks like you haven't added any beautiful handmade crafts to your collection yet.
            </p>
            <Link to="/shop" className="btn-olive block py-4">Explore the Collection</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-neutral-400 mb-16">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-bold text-slate-900">Shopping Bag</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Items List */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950">My Bag <span className="font-medium">({itemCount} items)</span></h1>
              {!user && (
                <button onClick={signIn} className="text-lg underline underline-offset-4 text-slate-950 hover:text-brand-primary">
                  Sign In
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-200">
            {items.map((item) => (
              <motion.div 
                key={item.cartKey}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-6"
              >
                <div className="aspect-[4/5] bg-brand-sand overflow-hidden">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-950 mb-4">{item.name}</h3>
                  <p className="text-sm text-slate-700 mb-5">In Stock</p>
                  
                  <label className="block text-sm font-bold text-slate-900 mb-2">Size</label>
                  <select
                    value={item.size}
                    onChange={(e) => updateSize(item.cartKey, e.target.value)}
                    className="mb-5 w-44 border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand-primary"
                  >
                    {SIZE_OPTIONS.map(size => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>

                  <label className="block text-sm font-bold text-slate-900 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-44 items-center justify-between border border-slate-300 px-3">
                      <button 
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="p-2 text-slate-500 hover:text-brand-primary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                         className="p-2 text-slate-500 hover:text-brand-primary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 flex items-center gap-4 text-sm">
                    <button className="underline underline-offset-4 hover:text-brand-primary">Gift Wrap</button>
                    <span className="text-slate-300">|</span>
                    <button 
                      onClick={() => removeFromCart(item.cartKey)}
                      className="underline underline-offset-4 hover:text-brand-primary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="text-xl font-black text-slate-950 sm:text-right">
                  {formatTk(item.price * item.quantity)}
                </div>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-slate-50 p-6 sticky top-32">
              <Link to="/checkout" className="block w-full bg-black py-4 text-center text-sm font-black uppercase tracking-widest text-white hover:bg-brand-secondary transition-colors">
                Checkout
              </Link>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 mt-8 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="border border-dashed border-slate-300 px-4 py-5 text-slate-500 font-medium">
                  Apply Points/Credits/Gift Card
                </div>
                <div className="flex justify-between text-slate-950 font-medium">
                  <span>Subtotal</span>
                  <span>{formatTk(total)}</span>
                </div>
                <div className="flex justify-between gap-6 text-slate-950 font-medium">
                  <span>Shipping (Standard: 3-4 days inside Dhaka and 4-7 days outside Dhaka)</span>
                  <span>{formatTk(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between text-slate-950 font-medium">
                  <span>VAT</span>
                  <span>{formatTk(vat)}</span>
                </div>
                <div className="pt-5 border-t border-slate-200 flex justify-between text-xl font-black text-slate-950">
                  <span>Total</span>
                  <span>{formatTk(grandTotal)}</span>
                </div>
              </div>
              
              <p className="text-sm font-bold leading-relaxed text-slate-800">
                Express delivery within 24 to 48 hours available for Dhaka City. Select option on next screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
