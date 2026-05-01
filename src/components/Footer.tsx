import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className="bg-white border-t border-slate-100 py-20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">AbleHands<span className="text-brand-primary">.</span></h3>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Connecting you with refined, handmade treasures from artisans around the world. Every purchase supports a story of resilience.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 font-sans">Marketplace</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-600">
              <li><Link to="/shop" className="hover:text-brand-primary transition-colors">All Crafts</Link></li>
              <li><Link to="/shop?category=pottery" className="hover:text-brand-primary transition-colors">Pottery & Ceramics</Link></li>
              <li><Link to="/shop?category=textiles" className="hover:text-brand-primary transition-colors">Textiles & Weaving</Link></li>
              <li><Link to="/shop?category=woodwork" className="hover:text-brand-primary transition-colors">Woodworking</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 font-sans">Community</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-600">
              <li><Link to="/stories" className="hover:text-brand-primary transition-colors">Artisan Stories</Link></li>
              <li><Link to="/loyalty" className="hover:text-brand-primary transition-colors">Loyalty Program</Link></li>
              <li><Link to="/blog" className="hover:text-brand-primary transition-colors">Craft Blog</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 font-sans">Follow Our Journey</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Facebook size={18} />
              </a>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">Newsletter</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
                <button className="absolute right-2 top-1.5 text-brand-primary hover:text-brand-primary/80">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 AbleHands Artisan Marketplace</p>
          <div className="flex gap-8">
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
