import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getFeaturedProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Home({ id }: { id?: string }) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const products = await getFeaturedProducts(5);
      setFeaturedProducts(products);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div id={id} className="pt-16 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-border rounded-full">
              <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Purpose-driven artisan goods</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Purchase with <br/>
              <span className="text-brand-primary">Purpose</span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-md leading-relaxed">
              Jotner Dokan connects persons with disabilities in Bangladesh to economic opportunity through eco-friendly home decor, daily-use products, and meaningful gifts.
            </p>
            
            <div className="flex gap-4">
              <Link to="/shop" className="btn-olive px-10 py-4 text-sm font-bold shadow-xl shadow-brand-primary/20">
                Shop the Market
              </Link>
              <Link to="/stories" className="btn-outline px-10 py-4 text-sm font-bold">
                Our Story
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="md:w-1/2 relative flex justify-center"
          >
            <div className="aspect-[4/5] w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl relative rotate-2 group hover:rotate-0 transition-transform duration-700">
               <img 
                 src="/assets/products/botanical-tote.jpg" 
                 alt="Jotner Dokan botanical canvas tote" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/75 to-transparent flex items-end p-10">
                  <div>
                    <p className="text-white font-bold text-lg mb-1">Botanical Canvas Tote</p>
                    <p className="text-slate-200 text-xs">Eco-friendly daily use, handmade with purpose</p>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary rounded-full blur-[80px] opacity-20 -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Our Product Line</h2>
              <p className="text-slate-500">Home decor, daily-use goods, and giftable art made through inclusive work.</p>
            </div>
            <Link to="/shop" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-2 transition-colors">
              Browse Market <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse bg-slate-50 h-80 rounded-2xl"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-sans text-xl border-2 border-dashed border-slate-100 rounded-3xl italic">
              No products available yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-5xl font-light mb-8">Creating <span className="serif-italic text-brand-primary text-6xl px-1">Economic Opportunity</span></h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed mb-12">
            Jotner Dokan is a social business empowering persons with disabilities by fostering financial independence, customized eco-friendly products, and market access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white tracking-tight">40</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Persons with disabilities and families in 2025</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white tracking-tight">5M</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">People with disabilities in Bangladesh</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white tracking-tight">B2C + B2B</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Marketplace, events, and partnerships</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-brand-primary/10 blur-[120px] -z-0"></div>
      </section>
    </div>
  );
}
