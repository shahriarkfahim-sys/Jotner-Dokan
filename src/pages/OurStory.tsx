import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const storyImages = [
  {
    src: '/assets/products/botanical-tote.jpg',
    alt: 'Handcrafted botanical tote bag',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/assets/products/flower-mug.jpg',
    alt: 'Decorated flower mug',
    className: '',
  },
  {
    src: '/assets/products/owl-shora.jpg',
    alt: 'Colorful owl shora canvas',
    className: '',
  },
  {
    src: '/assets/products/art-easel.jpg',
    alt: 'Moonlit canvas artwork on an easel',
    className: 'md:col-span-2',
  },
  {
    src: '/assets/products/wild-soul-tote.jpg',
    alt: 'Wild Soul tote bag',
    className: '',
  },
];

const impactPoints = [
  ['5M', 'persons with disabilities in Bangladesh'],
  ['$891M', 'possible yearly economic value through meaningful inclusion'],
  ['$356B+', 'growing global demand for sustainable home decor'],
];

export default function OurStory({ id }: { id?: string }) {
  return (
    <div id={id} className="bg-white pt-24">
      <section className="bg-brand-bg py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-950 md:text-7xl">
              Our Story
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-3"
          >
            {storyImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                className={`overflow-hidden rounded-2xl bg-brand-sand shadow-sm ${image.className}`}
              >
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-lg leading-8 text-slate-700 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p>In a small home in Bangladesh, a mother once kept her daughter inside.</p>
          <p>Not because she did not love her. But because she did not know what the world would offer her.</p>
          <p>
            Her daughter had a disability. There were no schools that felt accessible, no workplaces that felt welcoming,
            and no clear path to earning. Over time, the question stopped being <em>“what can she do?”</em> and quietly became
            <em> “what is possible for her?”</em>
          </p>
          <p className="text-2xl font-black leading-snug text-slate-950">This is not one story. This is millions.</p>
          <p>
            In Bangladesh, around <strong>5 million persons with disabilities</strong> live with similar realities.
            Conversations often focus on access, awareness, and rights. These matter. But when we looked closer, we found
            something more immediate, something that shapes everyday life: <strong>the absence of economic opportunity.</strong>
          </p>
          <p>
            Because when income is missing, everything else becomes harder. Independence becomes limited. Dignity becomes
            conditional. Inclusion remains incomplete.
          </p>
        </div>
      </section>

      <section className="bg-brand-bg py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">Why We Began</p>
              <h2 className="text-4xl font-medium leading-tight md:text-5xl">We did not start with a product.</h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-700">
              <p>
                We started with a belief: people do not need sympathy. They need opportunity.
              </p>
              <p>
                So we began working with persons with disabilities, especially women, to understand what they could create,
                what they wanted to learn, and what markets might value. Slowly, skills turned into products: handcrafted
                home decor, jewellery, and everyday items. More importantly, products turned into income.
              </p>
              <p>
                And income changed something deeper. The same mother who once hesitated now says,
                <em className="text-slate-950"> “My daughter earns.”</em> That sentence carries more than pride. It carries a
                shift in identity, confidence, and how society responds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8 text-lg leading-8 text-slate-700">
            <h2 className="text-4xl font-black text-slate-950">A bridge between potential and participation</h2>
            <p>
              Jotner Dokan works as a social business, connecting persons with disabilities to real markets. We support
              producers to create and sell through online platforms, events, and partnerships with organisations. The goal
              is simple: move from occasional support to <strong>consistent income.</strong>
            </p>
            <p>
              We are standing at the intersection of two realities: untapped human potential and expanding market demand.
              If persons with disabilities are meaningfully included in the economy, Bangladesh could unlock nearly
              <strong> $891 million in economic value each year.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {impactPoints.map(([value, label]) => (
              <div key={value} className="border border-brand-border bg-brand-bg p-8">
                <p className="text-5xl font-black text-brand-primary">{value}</p>
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-brand-olive">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-4xl px-4 text-lg leading-8 text-slate-700 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-black text-slate-950">Where We Are Going</h2>
          <div className="space-y-7">
            <p>
              Our journey is still early. We started with just a few individuals. Today, we are growing, reaching more
              producers, more families, and more markets each year. But for us, scale is not only about numbers. It is
              about how many lives move from dependence to contribution.
            </p>
            <p>
              Our <strong>vision</strong> is a world where persons with disabilities are not seen as outside the economy,
              but as active participants within it. Where inclusion means not just access, but income, ownership, and contribution.
            </p>
            <p>
              Our <strong>mission</strong> is to make that future practical by building a model that creates sustainable
              income opportunities, connects producers to growing markets, partners with organisations, and proves that
              inclusion can be both impactful and economically viable.
            </p>
            <p className="text-2xl font-black leading-snug text-slate-950">
              Jotner Dokan exists for a simple but often overlooked reason: when opportunity is created, people do not
              need to be included. They include themselves.
            </p>
            <p>And sometimes, all it takes to change a life is the chance to earn.</p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link to="/shop" className="btn-olive inline-flex items-center justify-center gap-2 px-8 py-4">
              Shop with Purpose <ArrowRight size={16} />
            </Link>
            <Link to="/voices" className="btn-outline inline-flex items-center justify-center px-8 py-4">
              Read Artisan's Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
