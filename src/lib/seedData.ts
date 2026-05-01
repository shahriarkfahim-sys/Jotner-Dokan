import { collection, addDoc, getDocs, deleteDoc, query } from 'firebase/firestore';
import { db } from './firebase';

const ARTISANS = [
  {
    id: 'artisan_1',
    name: 'Elara Moon',
    bio: 'Wheelchair-bound ceramicist finding rhythm in clay.',
    story: 'Elara discovered pottery as a form of physical therapy after a spinal cord injury. What began as exercise became her life\'s passion. She feels the texture of the clay as an extension of her own hands, creating organic forms that speak to the strength found in softness.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200',
    location: 'Portland, OR',
    specialties: ['Ceramics', 'Glazing'],
    disabilityInfo: 'Mobility Challenge',
  },
  {
    id: 'artisan_2',
    name: 'Julian Thorne',
    bio: 'Visually impaired weaver creating tactile stories.',
    story: 'Julian lost his sight in his early twenties. He turned to weaving because it allowed him to "see" with his fingers. Every thread is a deliberate choice, every knot a memory. His textiles are known for their intricate textures that offer a unique sensory experience.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200',
    location: 'Austin, TX',
    specialties: ['Textiles', 'Weaving'],
    disabilityInfo: 'Visually Impaired',
  },
  {
    id: 'artisan_3',
    name: 'Mina S.',
    bio: 'Neurodivergent jewelry designer finding peace in pattern.',
    story: 'Mina finds solace in the repetitiveness and precision of jewelry making. Her designs are inspired by the mathematical beauty she sees in the world—patterns that most people overlook. For Mina, each piece is a step towards a more structured and peaceful mind.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200',
    location: 'Denver, CO',
    specialties: ['Jewelry', 'Wire Wrapping'],
    disabilityInfo: 'Neurodivergent',
  }
];

const PRODUCTS = [
  // Home Decor
  { name: 'Abstract Ceramic Vase', category: 'Home Decor', price: 45, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800' },
  { name: 'Tactile Woven Rug', category: 'Home Decor', price: 120, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=800' },
  { name: 'Organic Clay Pitcher', category: 'Home Decor', price: 65, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800' },
  { name: 'Scented Candle Bowl', category: 'Home Decor', price: 35, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800' },
  { name: 'Macrame Wall Hanging', category: 'Home Decor', price: 85, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1528652399911-37966847424a?auto=format&fit=crop&w=800' },
  { name: 'Bamboo Serving Tray', category: 'Home Decor', price: 40, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&w=800' },
  { name: 'Embroidered Cushion', category: 'Home Decor', price: 55, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1579656335362-b244621d994k?auto=format&fit=crop&w=800' },
  { name: 'Hand-painted Planter', category: 'Home Decor', price: 28, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800' },
  { name: 'Floating Wood Shelf', category: 'Home Decor', price: 75, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1532372576044-673ab16a73aa?auto=format&fit=crop&w=800' },
  { name: 'Stained Glass Sun-catcher', category: 'Home Decor', price: 32, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800' },

  // Jewelry
  { name: 'Silver Filigree Earrings', category: 'Jewelry', price: 58, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60438?auto=format&fit=crop&w=800' },
  { name: 'Copper Wrap Bracelet', category: 'Jewelry', price: 42, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1573408304627-2c976939a37e?auto=format&fit=crop&w=800' },
  { name: 'Minimalist Gold Ring', category: 'Jewelry', price: 95, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800' },
  { name: 'Hand-dyed Silk Scarf', category: 'Jewelry', price: 48, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800' },
  { name: 'Beaded Statement Necklace', category: 'Jewelry', price: 72, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800' },
  { name: 'Turquoise Gemstone Studs', category: 'Jewelry', price: 35, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800' },
  { name: 'Leather Cuffed Watch', category: 'Jewelry', price: 110, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800' },
  { name: 'Ceramic Bead Anklet', category: 'Jewelry', price: 24, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1611085216949-b004246830dd?auto=format&fit=crop&w=800' },
  { name: 'Hammered Silver Bangle', category: 'Jewelry', price: 65, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800' },
  { name: 'Obsidian Pendant', category: 'Jewelry', price: 49, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800' },

  // Daily Use
  { name: 'Canvas Tote with Braille', category: 'Daily Use', price: 25, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1544816153-097305566a5a?auto=format&fit=crop&w=800' },
  { name: 'Recycled Leather Wallet', category: 'Daily Use', price: 38, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800' },
  { name: 'Handwoven Journal', category: 'Daily Use', price: 32, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800' },
  { name: 'Ceramic Travel Mug', category: 'Daily Use', price: 28, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800' },
  { name: 'Artisan Soap Sampler', category: 'Daily Use', price: 18, artisanIdx: 2, image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800' },
  { name: 'Linen Market Bag', category: 'Daily Use', price: 22, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1591348122449-025211803752?auto=format&fit=crop&w=800' },
  { name: 'Wooden Desk Organizer', category: 'Daily Use', price: 45, artisanIdx: 0, image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=800' },
  { name: 'Knitted Phone Pouch', category: 'Daily Use', price: 15, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1604537372136-23b0a701740h?auto=format&fit=crop&w=800' },
  { name: 'Herbal Eye Mask', category: 'Daily Use', price: 20, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1590602847861-f357a9302105?auto=format&fit=crop&w=800' },
  { name: 'Sustainable Water Bottle Sleeve', category: 'Daily Use', price: 12, artisanIdx: 1, image: 'https://images.unsplash.com/photo-1602143399827-7dc9469615c6?auto=format&fit=crop&w=800' },
];

export async function seedDemoData() {
  try {
    // 1. Clear existing products (optional but recommended for clean slate)
    const productSnap = await getDocs(collection(db, 'products'));
    for (const d of productSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 2. Clear existing artisans
    const artisanSnap = await getDocs(collection(db, 'artisans'));
    for (const d of artisanSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 3. Create Artisans
    const artisanIds: string[] = [];
    console.log('Creating artisans...');
    for (const a of ARTISANS) {
      const docRef = await addDoc(collection(db, 'artisans'), {
        name: a.name,
        bio: a.bio,
        story: a.story,
        avatarUrl: a.avatarUrl,
        location: a.location,
        specialties: a.specialties,
        disabilityInfo: a.disabilityInfo,
        createdAt: Date.now()
      });
      artisanIds.push(docRef.id);
      console.log(`Artisan ${a.name} created with ID: ${docRef.id}`);
    }

    // 4. Create Products
    console.log('Creating 30 products...');
    for (const p of PRODUCTS) {
      const artisanId = artisanIds[p.artisanIdx];
      await addDoc(collection(db, 'products'), {
        name: p.name,
        description: `Experience the artistry of ${ARTISANS[p.artisanIdx].name}. This ${p.name} is a testament to the skill and dedication found in our community. Made with premium materials and a commitment to quality.`,
        price: p.price,
        category: p.category,
        images: [p.image],
        artisanId: artisanId,
        stock: Math.floor(Math.random() * 20) + 5,
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200) + 50,
        createdAt: Date.now(),
        isFeatured: Math.random() > 0.7,
        tags: [p.category.toLowerCase(), 'handmade', 'artisan']
      });
    }

    console.log('Successfully seeded 30 products and 3 artisans.');
    alert('Success! 30 demo products and artisans have been seeded.');
  } catch (error) {
    console.error('Error seeding data:', error);
    alert('Failed to seed data. Check console.');
  }
}
