import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ id }: { id?: string }) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav id={id} className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/assets/brand/jotner-dokan-logo.png" alt="Jotner Dokan" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors">Market</Link>
            <Link to="/stories" className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors">Artisans</Link>
            <Link to="/stories" className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors">Stories</Link>
            
            {user && (
              <Link to="/admin" className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors bg-brand-primary/10 px-3 py-1 rounded-lg">Admin</Link>
            )}
            
            <div className="h-4 w-[1px] bg-slate-200"></div>
            
            <div className="flex items-center gap-5">
              <Link to="/wishlist" className="relative p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <Heart size={22} strokeWidth={1.5} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
              </Link>
              <Link to="/cart" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <ShoppingCart size={22} strokeWidth={1.5} />
              </Link>
              
              {user ? (
                <Link to="/profile" className="flex items-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-border flex items-center justify-center text-brand-primary font-bold text-xs hover:bg-brand-primary hover:text-white transition-all">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </Link>
              ) : (
                <Link to="/profile" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 active:scale-95">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-neutral-600">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-brand-clay text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </Link>
            <button 
              id="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-olive"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-sand overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/shop" className="block text-lg font-serif">Shop All Crafts</Link>
              <Link to="/stories" className="block text-lg font-serif">Artisan Stories</Link>
              <Link to="/wishlist" className="block text-lg font-serif">My Wishlist</Link>
              <Link to="/profile" className="block text-lg font-serif">My Account</Link>
              <div className="pt-4">
                <Link to="/checkout" className="btn-olive block text-center">Checkout Now</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
