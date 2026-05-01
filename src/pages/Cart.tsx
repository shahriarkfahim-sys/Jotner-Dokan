import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart({ id }: { id?: string }) {
  const { items, total, removeFromCart, updateQuantity, itemCount } = useCart();

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
    <div id={id} className="pt-32 pb-20 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif text-brand-olive mb-12">Your Creative Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-brand-sand/50 flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-brand-sand shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-serif text-xl text-brand-olive mb-1">{item.name}</h3>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">{item.category}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-brand-sand rounded-full px-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-brand-olive hover:scale-110 transition-transform"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="p-2 text-brand-olive hover:scale-110 transition-transform"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-brand-clay transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-2xl font-serif text-brand-clay sm:ml-auto">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[40px] shadow-md border border-brand-sand sticky top-32">
              <h2 className="text-2xl font-serif text-brand-olive mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-brand-olive">Free</span>
                </div>
                <div className="pt-4 border-t border-brand-sand flex justify-between text-xl font-serif text-brand-olive">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="btn-olive block text-center py-4 text-lg">Proceed to Checkout</Link>
              
              <p className="text-center text-[10px] text-neutral-400 mt-6 uppercase tracking-widest leading-relaxed px-4">
                By ordering, you support local artisans and the inclusive storytelling journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
