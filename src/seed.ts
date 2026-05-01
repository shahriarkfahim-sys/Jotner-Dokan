import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

const artisans = [
  {
    name: "Sarah Jenkins",
    bio: "Visual artist and weaver specializing in tactile textiles.",
    story: "Sarah lost her sight in her early twenties, but her passion for texture led her to master complex weaving patterns by touch.",
    artisanId: "artisan_sarah",
    location: "Portland, OR",
    specialties: ["Textiles", "Weaving"],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200"
  },
  {
    name: "David Chen",
    bio: "Ceramicist focused on minimalist, accessible kitchenware.",
    story: "After a spinal cord injury, David adapted his pottery wheel to be operated by hand controls, allowing him to continue his life's work.",
    artisanId: "artisan_david",
    location: "Seattle, WA",
    specialties: ["Pottery", "Ceramics"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200"
  }
];

const products = [
  {
    name: "Tactile Wool Throw",
    description: "A beautifully textured throw blanket hand-woven with organic wool. Every row is felted for a unique sensory experience.",
    price: 120,
    category: "Textiles",
    tags: ["woven", "wool", "homedecor"],
    images: ["https://images.unsplash.com/photo-1580302202102-46179fbf0e68?auto=format&fit=crop&w=800"],
    stock: 5,
    artisanId: "artisan_sarah",
    rating: 5,
    reviewCount: 12,
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    name: "Minimalist Tea Set",
    description: "A 3-piece ceramic tea set with ergonomic handles designed for ease of use. Matte glaze finish in earthy tones.",
    price: 85,
    category: "Pottery",
    tags: ["ceramics", "kitchen", "minimalist"],
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e17cb?auto=format&fit=crop&w=800"],
    stock: 10,
    artisanId: "artisan_david",
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true,
    createdAt: Date.now()
  },
  {
    name: "Hand-Carved Cedar Bowl",
    description: "Sculpted from reclaimed cedar wood, this bowl highlights the natural grain and warmth of the Pacific Northwest.",
    price: 65,
    category: "Woodwork",
    tags: ["woodwork", "nature", "handcarved"],
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800"],
    stock: 3,
    artisanId: "artisan_david",
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    createdAt: Date.now()
  }
];

export async function seedDatabase() {
  const productsSnap = await getDocs(collection(db, 'products'));
  if (productsSnap.empty) {
    console.log("Seeding database...");
    for (const artisan of artisans) {
      await addDoc(collection(db, 'artisans'), artisan);
    }
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
    console.log("Database seeded!");
  }
}
