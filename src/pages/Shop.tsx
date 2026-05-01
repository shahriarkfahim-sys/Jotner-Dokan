import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Home Decor', 'Jewelry', 'Daily Me'];

export default function Shop({ id }: { id?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function load() {
      const all = await getAllProducts();
      setProducts(all);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return b.createdAt - a.createdAt;
  });

  return (
    <div id={id} className="pt-32 pb-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-5xl font-serif text-brand-olive mb-4">The Collection</h1>
          <p className="text-neutral-500 max-w-xl">Browse our curated selection of unique handmade crafts, each piece carrying the soul and story of its creator.</p>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search crafts, stories, materials..." 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-brand-sand focus:outline-none focus:border-brand-olive transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-brand-sand hover:border-brand-olive transition-all"
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-6 py-3 rounded-full bg-white border border-brand-sand hover:border-brand-olive transition-all text-sm font-medium outline-none pr-10"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-12 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === category 
                ? 'bg-brand-olive text-white shadow-md' 
                : 'bg-white text-neutral-600 border border-brand-sand hover:border-brand-olive'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse bg-white/50 rounded-[32px] aspect-[3/4.5]"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-brand-sand">
            <h3 className="text-2xl font-serif text-brand-olive mb-2">No crafts found</h3>
            <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
