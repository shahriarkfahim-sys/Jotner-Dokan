import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ArtisanProfile } from '../types';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export default function ArtisanStories({ id }: { id?: string }) {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'artisans'));
        setArtisans(snap.docs.map(d => ({ id: d.id, ...d.data() } as ArtisanProfile)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'artisans');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div id={id} className="pt-32 pb-20 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-6xl font-serif text-brand-olive mb-6">Our <span className="serif-italic text-brand-clay pr-2">Voices</span></h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Every craft in our collection is a chapter in a much larger story. Meet the resilient hands behind the beauty, and discover the journeys that inspire us every day.
          </p>
        </header>

        {loading ? (
          <div className="space-y-24">
            {[1,2].map(i => (
              <div key={i} className="animate-pulse bg-white/50 h-96 rounded-[64px]"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-32">
            {artisans.map((artisan, idx) => (
              <motion.section 
                key={artisan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
              >
                <div className="md:w-1/2 relative">
                  <div className="aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform bg-brand-sand">
                    <img src={artisan.avatarUrl} alt={artisan.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-brand-clay text-white px-8 py-4 rounded-full font-serif text-xl shadow-lg z-10">
                    {artisan.location}
                  </div>
                </div>
                
                <div className="md:w-1/2 space-y-8">
                  <span className="text-brand-clay font-bold uppercase tracking-[0.3em] text-xs">Featured Artisan</span>
                  <h2 className="text-5xl font-serif text-brand-olive">{artisan.name}</h2>
                  
                  <div className="relative">
                    <Quote className="absolute -top-10 -left-10 text-brand-sand w-20 h-20 opacity-30 pointer-events-none" />
                    <p className="text-2xl font-serif text-brand-olive/80 leading-relaxed italic z-10 relative">
                      "{artisan.bio}"
                    </p>
                  </div>

                  <div className="space-y-4 text-neutral-600 leading-relaxed">
                    {artisan.story.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {artisan.specialties.map(spec => (
                      <span key={spec} className="px-5 py-2 bg-white border border-brand-sand rounded-full text-xs font-bold uppercase tracking-widest text-brand-olive">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
