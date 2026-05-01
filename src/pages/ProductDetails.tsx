import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { Product, Review, ArtisanProfile } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, MapPin, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductRecommendations } from '../lib/gemini';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getProductById } from '../services/productService';

export default function ProductDetails({ id: pageId }: { id?: string }) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          
          // Load Artisan
          if (productData.artisanId) {
            const artisanSnap = await getDoc(doc(db, 'artisans', productData.artisanId));
            if (artisanSnap.exists()) {
              setArtisan({ id: artisanSnap.id, ...artisanSnap.data() } as ArtisanProfile);
            }
          }
          
          // Load reviews
          if (!productData.id.startsWith('jotner-')) {
            const reviewsRef = collection(db, 'products', id, 'reviews');
            const q = query(reviewsRef, orderBy('createdAt', 'desc'));
            const reviewsSnap = await getDocs(q);
            setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
          }

          // Get recommendations using Gemini
          const allProducts = await getAllProducts();
          const recIds = await getProductRecommendations(
            `I like this product: ${productData.name}. Its category is ${productData.category}. ${productData.description}`,
            allProducts.filter(p => p.id !== id)
          );
          setRecommendedProducts(allProducts.filter(p => recIds.includes(p.id)));
        }
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      }
    }
    loadProduct();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setIsSubmittingReview(true);
    try {
      const reviewData = {
        productId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: Date.now(),
      };
      const docRef = await addDoc(collection(db, 'products', id, 'reviews'), reviewData);
      setReviews([{ id: docRef.id, ...reviewData }, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}/reviews`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <div className="pt-32 text-center font-serif text-2xl animate-pulse">Gathering beauty...</div>;
  if (!product) return <div className="pt-32 text-center font-serif text-2xl">Craft not found.</div>;

  return (
    <div id={pageId} className="pt-32 pb-20 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Images */}
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="aspect-square rounded-[40px] overflow-hidden bg-brand-sand shadow-lg"
            >
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-brand-sand cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-6">
              <Link to="/shop" className="hover:text-brand-olive transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-brand-olive font-bold">{product.category}</span>
            </nav>

            <h1 className="text-5xl font-serif text-brand-olive mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-brand-clay">
                {[1,2,3,4,5].map(star => (
                   <Star key={star} size={18} fill={star <= product.rating ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-neutral-500">({product.reviewCount} customer reviews)</span>
            </div>

            <div className="text-3xl font-serif text-brand-clay mb-8">${product.price}</div>

            <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-olive/10 rounded-lg text-brand-olive">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Standard Shipping</h4>
                  <p className="text-xs text-neutral-500">Ships within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-clay/10 rounded-lg text-brand-clay">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Resilience Guaranteed</h4>
                  <p className="text-xs text-neutral-500">Each piece is quality checked</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToCart(product)}
                className="flex-[2] btn-olive py-4 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                <span>Add to My Cart</span>
              </button>
              <button className="flex-1 btn-outline py-4 flex items-center justify-center gap-3">
                <Heart size={20} />
                <span>Wishlist</span>
              </button>
            </div>

            {/* Artisan Spotlight */}
            {artisan && (
              <div className="bg-white p-8 rounded-[32px] border border-brand-sand/50 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center gap-5 mb-6 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-brand-sand overflow-hidden border-2 border-white shadow-md">
                      <img 
                        src={artisan.avatarUrl || "https://images.unsplash.com/photo-1502485019198-a625bd536253?auto=format&fit=crop&w=200"} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-1 block">The Maker Behind</span>
                      <h4 className="font-serif text-2xl text-brand-olive">{artisan.name}</h4>
                      <p className="text-xs text-brand-muted">{artisan.location} • {artisan.disabilityInfo}</p>
                    </div>
                 </div>
                 
                 <div className="relative z-10">
                   <div className="flex gap-4 mb-4">
                     <Quote className="text-brand-primary opacity-20 shrink-0" size={24} />
                     <p className="text-sm text-neutral-600 italic leading-relaxed">
                       {artisan.story}
                     </p>
                   </div>
                   <Link 
                     to={`/artisan/${artisan.id}`} 
                     className="inline-flex items-center gap-2 text-xs text-brand-primary font-bold hover:underline"
                   >
                     Read {artisan.name.split(' ')[0]}'s Full Story
                   </Link>
                 </div>
                 <MapPin size={120} className="absolute -bottom-10 -right-10 text-brand-sand opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        {recommendedProducts.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-serif mb-8 text-brand-olive">Chosen Just for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="bg-white rounded-[40px] p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="col-span-1">
              <h2 className="text-3xl font-serif mb-6 text-brand-olive">Stories from Our Customers</h2>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-serif text-brand-olive">{product.rating}</span>
                <div>
                  <div className="flex text-brand-clay mb-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={16} fill={star <= product.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">Average Rating</span>
                </div>
              </div>

              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-4 pt-8 border-t border-brand-sand">
                  <h4 className="font-serif text-lg">Share your thoughts</h4>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="text-brand-clay hover:scale-110 transition-transform"
                      >
                        <Star size={24} fill={star <= newReview.rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Write your review here..." 
                    className="w-full bg-brand-cream/50 border border-brand-sand rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-olive min-h-[120px]"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />
                  <button 
                    id="submit-review-btn"
                    disabled={isSubmittingReview}
                    className="w-full btn-olive py-3 disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-brand-cream/50 rounded-2xl text-center">
                  <p className="text-sm text-neutral-500 mb-4">You must be signed in to leave a review.</p>
                  <button className="btn-outline w-full py-2 text-sm">Sign In</button>
                </div>
              )}
            </div>

            <div className="col-span-2 space-y-8">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="pb-8 border-b border-brand-sand/50 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-sm">{review.userName}</span>
                       <span className="text-xs text-neutral-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-brand-clay mb-3">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={12} fill={star <= review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="text-neutral-600 italic leading-relaxed">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-neutral-400 italic font-serif">
                  Be the first to share your experience with this craft.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
