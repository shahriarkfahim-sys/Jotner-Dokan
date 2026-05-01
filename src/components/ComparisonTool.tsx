import { useState } from 'react';
import { Product } from '../types';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ComparisonTool({ products, onClose }: { products: Product[], onClose: () => void }) {
  if (products.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto bg-brand-olive text-white rounded-[40px] shadow-2xl p-8 border border-white/10 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-2xl font-serif mb-8 flex items-center gap-2">
          <span>Compare Crafts</span>
          <span className="text-xs bg-brand-clay px-2 py-1 rounded-full">{products.length} selected</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {products.map(product => (
             <div key={product.id} className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white/10">
                   <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="font-serif text-lg">{product.name}</h4>
                   <p className="text-brand-sand font-bold">${product.price}</p>
                </div>
                <div className="text-xs text-brand-cream/60 leading-relaxed line-clamp-3">
                   {product.description}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2">
                   <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-sand">
                      <span>Rating</span>
                      <span>{product.rating}/5</span>
                   </div>
                   <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-sand">
                      <span>Availability</span>
                      <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                   </div>
                </div>
             </div>
           ))}
           
           {products.length < 4 && (
             <div className="border-2 border-dashed border-white/10 rounded-[32px] flex items-center justify-center text-white/20 font-serif text-xl p-8">
                Add another to compare
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
