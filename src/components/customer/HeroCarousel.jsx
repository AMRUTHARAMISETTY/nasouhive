import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileGlyph, cn } from '../mobile/MobileAppShell';

const posters = [
  {
    id: 'connected-commerce',
    label: 'Trusted Commerce, Connected',
    heading: 'Discover better products. Powered by smarter supply chains.',
    subtitle: 'Shop directly from trusted retailers connected through the Nasou Hive ecosystem.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Shop Now', action: 'shop' },
    secondary: { label: 'Explore Categories', action: 'categories' },
  },
  {
    id: 'fresh-groceries',
    label: 'Fresh Picks',
    heading: 'Farm-fresh groceries delivered with trust.',
    subtitle: 'Discover quality essentials from verified retailers near you.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Buy Groceries', action: 'groceries' },
    secondary: { label: 'View Deals', action: 'deals' },
  },
  {
    id: 'fashion-lifestyle',
    label: 'Style Drop',
    heading: 'Upgrade your wardrobe with curated fashion.',
    subtitle: 'Explore premium styles, trending collections, and smart offers.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Shop Fashion', action: 'fashion' },
    secondary: { label: 'New Arrivals', action: 'new-arrivals' },
  },
  {
    id: 'smart-tech',
    label: 'Smart Tech',
    heading: 'Electronics that fit your modern lifestyle.',
    subtitle: 'Find trusted gadgets, appliances, and accessories at better prices.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Explore Tech', action: 'electronics' },
    secondary: { label: 'Compare Prices', action: 'compare' },
  },
  {
    id: 'home-essentials',
    label: 'Home Essentials',
    heading: 'Everything your home needs, beautifully organized.',
    subtitle: 'Shop daily essentials, kitchen products, and household supplies.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Shop Home', action: 'home' },
    secondary: { label: 'View Offers', action: 'deals' },
  },
  {
    id: 'beauty-care',
    label: 'Beauty Edit',
    heading: 'Everyday care, elevated by trusted brands.',
    subtitle: 'Discover skincare, wellness, and personal-care essentials selected for you.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Shop Beauty', action: 'beauty' },
    secondary: { label: 'Top Rated', action: 'top-rated' },
  },
  {
    id: 'festival-offers',
    label: 'Festival Offers',
    heading: 'Celebrate more with prices worth waiting for.',
    subtitle: 'Unlock limited-time savings, reward boosters, and festive bundles.',
    image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Explore Offers', action: 'deals' },
    secondary: { label: 'View Rewards', action: 'rewards' },
  },
  {
    id: 'daily-new',
    label: 'Daily Deals & New Arrivals',
    heading: 'New discoveries. Fresh value. Every day.',
    subtitle: 'Meet the latest launches and daily offers from verified Nasou Hive retailers.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1800&q=88',
    primary: { label: 'Daily Deals', action: 'deals' },
    secondary: { label: 'New Arrivals', action: 'new-arrivals' },
  },
];

function HeroCarousel({ onAction }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % posters.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const showPoster = (nextIndex, nextDirection) => {
    setDirection(nextDirection);
    setActiveIndex((nextIndex + posters.length) % posters.length);
  };

  const activePoster = posters[activeIndex];

  return (
    <section
      className="group relative min-h-[440px] overflow-hidden rounded-[24px] bg-[#173D33] shadow-[0_28px_70px_rgba(31,59,52,0.18)] sm:min-h-[500px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured shopping campaigns"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={activePoster.id}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 70 : -70, scale: 1.025 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 1.01 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={activePoster.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,54,44,0.97)_0%,rgba(18,54,44,0.82)_43%,rgba(18,54,44,0.26)_76%,rgba(18,54,44,0.12)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#153C32]/45 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[440px] max-w-3xl flex-col justify-center px-6 pb-20 pt-12 text-white sm:min-h-[500px] sm:px-12 lg:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activePoster.id}-content`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.48, delay: 0.08 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D5E5DF] sm:text-xs">{activePoster.label}</p>
            <h1 className="mt-5 max-w-[760px] text-4xl font-semibold leading-[1.03] text-white sm:text-5xl lg:text-[58px]">{activePoster.heading}</h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#E6ECEA] sm:text-base">{activePoster.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAction(activePoster.primary.action)} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1F5C4A] shadow-lg transition hover:-translate-y-0.5">
                {activePoster.primary.label}
              </button>
              <button type="button" onClick={() => onAction(activePoster.secondary.action)} className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/18">
                {activePoster.secondary.label}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button type="button" onClick={() => showPoster(activeIndex - 1, -1)} aria-label="Previous poster" className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#173D33]/45 text-white opacity-100 backdrop-blur-lg transition hover:bg-[#173D33]/75 sm:left-5 lg:opacity-0 lg:group-hover:opacity-100">
        <MobileGlyph name="chevron" className="h-5 w-5 rotate-180" />
      </button>
      <button type="button" onClick={() => showPoster(activeIndex + 1, 1)} aria-label="Next poster" className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#173D33]/45 text-white opacity-100 backdrop-blur-lg transition hover:bg-[#173D33]/75 sm:right-5 lg:opacity-0 lg:group-hover:opacity-100">
        <MobileGlyph name="chevron" className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-[#173D33]/35 px-3 py-2 backdrop-blur-lg">
        {posters.map((poster, index) => (
          <button
            key={poster.id}
            type="button"
            onClick={() => showPoster(index, index > activeIndex ? 1 : -1)}
            aria-label={`Show poster ${index + 1}: ${poster.label}`}
            className={cn('h-2 rounded-full transition-all duration-300', index === activeIndex ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/75')}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
