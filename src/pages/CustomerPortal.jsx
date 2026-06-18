import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  bestDeals,
  customerCategories,
  faqs,
  orderHistory,
  orderTimeline,
  paymentMethods,
  profileSections,
  recommendedProducts,
  recentlyViewed,
  rewardSummary,
  trendingProducts,
} from '../data/customerPortalData';
import { MobileGlyph, cn } from '../components/mobile/MobileAppShell';
import { CustomerIcon } from '../components/customer/CustomerUI';
import HeroCarousel from '../components/customer/HeroCarousel';

const allProducts = [...recommendedProducts, ...trendingProducts, ...recentlyViewed];
const categoryImages = {
  Groceries: recommendedProducts[1].image,
  Electronics: trendingProducts[0].image,
  'Home Living': recommendedProducts[2].image,
  Beauty: trendingProducts[3].image,
  Wellness: recommendedProducts[3].image,
  Accessories: trendingProducts[4].image,
};

function ProductCard({ product, onOpen, onAdd, wished, onWishlist, compact = false }) {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return (
    <motion.article whileHover={{ y: -5 }} className="group min-w-0 overflow-hidden rounded-[18px] border border-white/75 bg-white shadow-[0_16px_38px_rgba(37,88,73,0.09)]">
      <div className={cn('relative overflow-hidden bg-[#E6ECEA]', compact ? 'aspect-square' : 'aspect-[4/3]')}>
        <button type="button" onClick={() => onOpen(product)} className="h-full w-full">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        </button>
        <button type="button" onClick={() => onWishlist(product)} aria-label="Save to wishlist" className={cn('absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/90 shadow-sm', wished ? 'text-rose-500' : 'text-[#1F5C4A]')}>
          <CustomerIcon name="heart" className={cn('h-4 w-4', wished && 'fill-current')} />
        </button>
        {product.badge ? <span className="absolute left-3 top-3 rounded-full bg-[#1F5C4A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">{product.badge}</span> : null}
      </div>
      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#71837D]">{product.category}</p>
        <button type="button" onClick={() => onOpen(product)} className="mt-1 block max-w-full truncate text-left text-base font-semibold text-[#1F3B34]">{product.name}</button>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#61756E]">
          <CustomerIcon name="star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-[#1F3B34]">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><p className="text-lg font-semibold text-[#1F3B34]">${product.price}</p>{discount ? <span className="text-xs font-bold text-emerald-600">{discount}% off</span> : null}</div>
            {product.originalPrice ? <p className="text-xs text-[#84938E] line-through">${product.originalPrice}</p> : <p className="text-xs text-[#71837D]">{product.supplier}</p>}
          </div>
          <button type="button" onClick={() => onAdd(product)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1F5C4A] text-white transition hover:bg-[#255849]" aria-label={`Add ${product.name} to cart`}>
            <MobileGlyph name="plus" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function SectionTitle({ title, subtitle, action, onAction }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div><h2 className="text-xl font-semibold text-[#1F3B34] sm:text-2xl">{title}</h2>{subtitle ? <p className="mt-1 text-sm text-[#71837D]">{subtitle}</p> : null}</div>
      {action ? <button type="button" onClick={onAction} className="shrink-0 text-xs font-bold text-[#1F5C4A] hover:underline">{action}</button> : null}
    </div>
  );
}

function CustomerPortal() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(trendingProducts[0]);
  const [productOpen, setProductOpen] = useState(false);
  const [cartItems, setCartItems] = useState([{ ...trendingProducts[0], quantity: 1 }, { ...recommendedProducts[1], quantity: 1 }]);
  const [wishlist, setWishlist] = useState([recommendedProducts[2].id]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutMethod, setCheckoutMethod] = useState('UPI');
  const [noticeOpen, setNoticeOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = allProducts.filter((item) => {
      const matchesSearch = !query || [item.name, item.category, item.supplier, item.badge].filter(Boolean).join(' ').toLowerCase().includes(query);
      return matchesSearch && (category === 'All' || item.category === category);
    });
    if (sortBy === 'Price Low to High') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'Price High to Low') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'Best Rated') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Newest') result = [...result].sort((a, b) => b.id - a.id);
    return result;
  }, [category, search, sortBy]);

  const wishlistProducts = allProducts.filter((product) => wishlist.includes(product.id));
  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);
    return { subtotal, savings, shipping: subtotal > 50 ? 0 : 5, total: subtotal + (subtotal > 50 ? 0 : 5) };
  }, [cartItems]);

  const openProduct = (product) => { setSelectedProduct(product); setProductOpen(true); };
  const addToCart = (product) => setCartItems((prev) => {
    const existing = prev.find((item) => item.id === product.id);
    return existing ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...prev, { ...product, quantity: 1 }];
  });
  const toggleWishlist = (product) => setWishlist((prev) => prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]);
  const updateQuantity = (id, change) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  const handleHeroAction = (action) => {
    if (action === 'categories') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (action === 'rewards') {
      setActivePage('rewards');
      return;
    }
    const categoryByAction = {
      groceries: 'Groceries',
      electronics: 'Electronics',
      compare: 'Electronics',
      home: 'Home Living',
      beauty: 'Beauty',
    };
    setCategory(categoryByAction[action] || 'All');
    if (action === 'new-arrivals') setSortBy('Newest');
    if (action === 'top-rated') setSortBy('Best Rated');
    setActivePage('discover');
  };

  const navItems = [
    ['home', 'Home', 'home'],
    ['discover', 'Shop', 'search'],
    ['wishlist', 'Wishlist', 'heart'],
    ['orders', 'Orders', 'orders'],
    ['profile', 'Profile', 'user'],
  ];

  return (
    <div className="min-h-screen bg-[#EFEAE1] text-[#1F3B34]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#EFEAE1]/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setActivePage('home')} className="flex shrink-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#1F5C4A] text-base font-black text-white">N</span>
            <span className="hidden text-lg font-black text-[#1F3B34] sm:block">Nasou Hive</span>
          </button>
          <label className="mx-auto flex min-h-12 w-full max-w-2xl items-center gap-3 rounded-[16px] border border-white/80 bg-white px-4 shadow-[0_10px_24px_rgba(37,88,73,0.07)]">
            <MobileGlyph name="search" className="h-5 w-5 text-[#61756E]" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value) setActivePage('discover'); }} placeholder="Search products, brands, categories..." className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#1F3B34] outline-none placeholder:text-[#84938E]" />
            <button type="button" title="Voice search" aria-label="Voice search" className="text-[#1F5C4A]"><MobileGlyph name="mic" className="h-5 w-5" /></button>
          </label>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button type="button" onClick={() => setActivePage('wishlist')} aria-label="Wishlist" className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#1F5C4A]"><CustomerIcon name="heart" className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#1F5C4A] px-1 text-[10px] font-bold text-white">{wishlist.length}</span></button>
            <button type="button" onClick={() => setNoticeOpen(true)} aria-label="Notifications" className="hidden h-11 w-11 place-items-center rounded-full bg-white text-[#1F5C4A] sm:grid"><MobileGlyph name="bell" className="h-5 w-5" /></button>
            <button type="button" onClick={() => setActivePage('cart')} aria-label="Cart" className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#1F5C4A]"><MobileGlyph name="cart" className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#1F5C4A] px-1 text-[10px] font-bold text-white">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
            <button type="button" onClick={() => setActivePage('profile')} className="grid h-11 w-11 place-items-center rounded-full bg-[#1F5C4A] text-xs font-black text-white">AR</button>
          </div>
        </div>
        <nav className="hidden border-t border-white/60 bg-white/35 lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-7 px-8 py-3 text-sm font-bold text-[#526A62]">
            {navItems.map(([key, label]) => <button key={key} type="button" onClick={() => setActivePage(key)} className={cn('transition hover:text-[#1F5C4A]', activePage === key && 'text-[#1F5C4A]')}>{label}</button>)}
            <button type="button" onClick={() => { setCategory('Electronics'); setActivePage('discover'); }}>Electronics</button>
            <button type="button" onClick={() => { setCategory('Groceries'); setActivePage('discover'); }}>Groceries</button>
            <button type="button" onClick={() => setActivePage('rewards')}>Rewards</button>
            <span className="ml-auto text-xs text-[#71837D]">Free delivery above $50</span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12">
        <AnimatePresence mode="wait">
          {activePage === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <HeroCarousel onAction={handleHeroAction} />

              <section>
                <SectionTitle title="Recommended For You" subtitle="Personal picks based on your browsing and purchase history" action="View all" onAction={() => setActivePage('discover')} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recommendedProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} />)}</div>
              </section>

              <section id="categories">
                <SectionTitle title="Shop by Category" subtitle="Explore curated collections from verified retailers" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {customerCategories.map((item) => (
                    <motion.button key={item.name} whileHover={{ y: -4 }} type="button" onClick={() => { setCategory(item.name); setActivePage('discover'); }} className="relative aspect-[4/5] overflow-hidden rounded-[18px] text-left text-white">
                      <img src={categoryImages[item.name] || recentlyViewed[0].image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#173D33]/90 via-transparent to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-4"><span className="block text-sm font-bold">{item.name}</span><span className="mt-1 block text-[11px] text-white/75">{item.count}</span></span>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle title="Trending Products" subtitle="What shoppers across Nasou Hive are buying now" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{trendingProducts.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} compact />)}</div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="overflow-hidden rounded-[24px] bg-[#1F3B34] p-6 text-white sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9D7D2]">Flash Deals</p><h2 className="mt-3 text-3xl font-semibold">Today only. Better prices, verified supply.</h2><p className="mt-3 text-sm text-[#C9D7D2]">Ends in <span className="font-bold text-white">08 : 24 : 16</span></p></div>
                    <button type="button" onClick={() => setActivePage('discover')} className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1F5C4A]">Explore deals</button>
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">{bestDeals.map((deal) => <div key={deal.title} className="rounded-[16px] border border-white/10 bg-white/[0.07] p-4"><p className="text-sm font-bold">{deal.title}</p><p className="mt-2 text-xs leading-5 text-[#C9D7D2]">{deal.subtitle}</p><span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold">{deal.code}</span></div>)}</div>
                </div>
                <div className="rounded-[24px] border border-white/75 bg-white p-6 shadow-[0_18px_40px_rgba(37,88,73,0.08)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71837D]">Nasou Rewards</p><p className="mt-3 text-4xl font-semibold text-[#1F3B34]">{rewardSummary.points}</p><p className="mt-1 text-sm text-[#61756E]">{rewardSummary.tier}</p>
                  <div className="mt-6 h-2 rounded-full bg-[#E6ECEA]"><div className="h-full w-[72%] rounded-full bg-[#1F5C4A]" /></div>
                  <p className="mt-3 text-xs text-[#71837D]">720 points to Platinum</p>
                  <button type="button" onClick={() => setActivePage('rewards')} className="mt-6 w-full rounded-xl bg-[#E6ECEA] px-4 py-3 text-sm font-bold text-[#1F5C4A]">View rewards</button>
                </div>
              </section>

              <section>
                <SectionTitle title="New Arrivals" subtitle="Fresh launches from trusted stores" />
                <div className="grid gap-4 sm:grid-cols-3">{recentlyViewed.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} />)}</div>
              </section>
            </motion.div>
          ) : null}

          {activePage === 'discover' ? (
            <motion.div key="discover" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71837D]">Marketplace</p><h1 className="mt-2 text-3xl font-semibold text-[#1F3B34]">Discover products</h1><p className="mt-2 text-sm text-[#61756E]">{filteredProducts.length} products from verified retailers</p></div>
              <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
                <aside className="h-fit rounded-[18px] border border-white/75 bg-white p-5 shadow-[0_16px_38px_rgba(37,88,73,0.07)]">
                  <p className="text-sm font-bold text-[#1F3B34]">Filters</p>
                  <div className="mt-5 space-y-5">
                    <label className="block"><span className="text-xs font-bold text-[#61756E]">Category</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#DFE7E3] bg-white px-3 text-sm outline-none"><option>All</option>{customerCategories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
                    <label className="block"><span className="text-xs font-bold text-[#61756E]">Maximum price</span><input type="range" min="20" max="150" defaultValue="150" className="mt-3 w-full accent-[#1F5C4A]" /></label>
                    {['In stock only', '4+ rating', 'Discounted', 'Same-day delivery'].map((filter) => <label key={filter} className="flex items-center gap-2 text-sm text-[#526A62]"><input type="checkbox" className="accent-[#1F5C4A]" />{filter}</label>)}
                  </div>
                </aside>
                <div>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2 overflow-x-auto">{['All', ...customerCategories.map((item) => item.name)].map((item) => <button key={item} onClick={() => setCategory(item)} className={cn('shrink-0 rounded-full px-4 py-2 text-xs font-bold', category === item ? 'bg-[#1F5C4A] text-white' : 'bg-white text-[#526A62]')}>{item}</button>)}</div>
                    <div className="flex gap-2"><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="min-h-10 rounded-xl border border-white/80 bg-white px-3 text-xs font-bold text-[#526A62] outline-none">{['Popularity', 'Price Low to High', 'Price High to Low', 'Newest', 'Best Rated'].map((item) => <option key={item}>{item}</option>)}</select><div className="flex rounded-xl bg-white p-1">{['grid', 'list'].map((mode) => <button key={mode} type="button" onClick={() => setViewMode(mode)} className={cn('grid h-8 w-8 place-items-center rounded-lg', viewMode === mode ? 'bg-[#1F5C4A] text-white' : 'text-[#61756E]')}><MobileGlyph name={mode} className="h-4 w-4" /></button>)}</div></div>
                  </div>
                  {viewMode === 'grid' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={`${product.id}-${product.name}`} product={product} onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} />)}</div> : <div className="space-y-3">{filteredProducts.map((product) => <div key={product.id} className="flex gap-4 rounded-[18px] bg-white p-4 shadow-sm"><img src={product.image} alt={product.name} className="h-24 w-24 rounded-[14px] object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase text-[#71837D]">{product.category}</p><button onClick={() => openProduct(product)} className="mt-1 text-left font-semibold text-[#1F3B34]">{product.name}</button><p className="mt-2 text-sm text-[#61756E]">{product.supplier} · {product.rating} rating</p></div><div className="text-right"><p className="font-semibold">${product.price}</p><button onClick={() => addToCart(product)} className="mt-4 rounded-xl bg-[#1F5C4A] px-3 py-2 text-xs font-bold text-white">Add</button></div></div>)}</div>}
                </div>
              </div>
            </motion.div>
          ) : null}

          {activePage === 'cart' ? (
            <motion.div key="cart" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <section><SectionTitle title="Shopping Cart" subtitle={`${cartItems.length} products ready for checkout`} /><div className="space-y-3">{cartItems.map((item) => <div key={item.id} className="flex gap-4 rounded-[18px] bg-white p-4 shadow-sm"><img src={item.image} alt={item.name} className="h-24 w-24 rounded-[14px] object-cover" /><div className="min-w-0 flex-1"><p className="font-semibold text-[#1F3B34]">{item.name}</p><p className="mt-1 text-xs text-[#71837D]">{item.supplier} · In stock</p><button type="button" onClick={() => toggleWishlist(item)} className="mt-3 text-xs font-bold text-[#1F5C4A]">Save for later</button></div><div className="flex flex-col items-end justify-between"><p className="font-semibold">${item.price * item.quantity}</p><div className="flex items-center rounded-xl bg-[#F0F4F2] p-1"><button onClick={() => updateQuantity(item.id, -1)} className="grid h-8 w-8 place-items-center">-</button><span className="w-8 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="grid h-8 w-8 place-items-center">+</button></div></div></div>)}</div><div className="mt-6"><SectionTitle title="Frequently Bought Together" /><div className="grid gap-4 sm:grid-cols-3">{recentlyViewed.map((product) => <ProductCard key={product.id} product={product} compact onOpen={openProduct} onAdd={addToCart} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} />)}</div></div></section>
              <aside className="h-fit rounded-[20px] bg-white p-5 shadow-[0_18px_40px_rgba(37,88,73,0.09)]"><h2 className="text-lg font-semibold">Order Summary</h2><div className="mt-5 space-y-3 text-sm text-[#61756E]"><div className="flex justify-between"><span>Subtotal</span><span>${cartSummary.subtotal}</span></div><div className="flex justify-between text-emerald-600"><span>Savings</span><span>-${cartSummary.savings}</span></div><div className="flex justify-between"><span>Shipping</span><span>{cartSummary.shipping ? `$${cartSummary.shipping}` : 'Free'}</span></div><div className="flex justify-between border-t border-[#E5ECE8] pt-4 text-lg font-semibold text-[#1F3B34]"><span>Total</span><span>${cartSummary.total}</span></div></div><div className="mt-5 flex gap-2"><input placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-[#DFE7E3] px-3 text-sm outline-none" /><button className="rounded-xl bg-[#E6ECEA] px-3 py-3 text-xs font-bold text-[#1F5C4A]">Apply</button></div><button onClick={() => { setCheckoutStep(1); setActivePage('checkout'); }} className="mt-5 w-full rounded-xl bg-[#1F5C4A] px-5 py-3 text-sm font-bold text-white">Proceed to Checkout</button><p className="mt-3 text-center text-[11px] text-[#84938E]">Secure checkout · Easy returns</p></aside>
            </motion.div>
          ) : null}

          {activePage === 'checkout' ? (
            <motion.div key="checkout" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
              <SectionTitle title="Checkout" subtitle="Secure, simple and protected" />
              <div className="mb-6 grid grid-cols-4 gap-2">{['Address', 'Delivery', 'Payment', 'Review'].map((step, index) => <div key={step}><div className={cn('h-1.5 rounded-full', checkoutStep >= index + 1 ? 'bg-[#1F5C4A]' : 'bg-[#D9E2DE]')} /><p className="mt-2 text-center text-xs font-bold text-[#61756E]">{step}</p></div>)}</div>
              <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_40px_rgba(37,88,73,0.08)] sm:p-7">
                {checkoutStep === 1 ? <div><h2 className="text-lg font-semibold">Delivery address</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button className="rounded-[16px] border-2 border-[#1F5C4A] bg-[#F4F7F5] p-4 text-left"><p className="font-bold">Home</p><p className="mt-2 text-sm leading-6 text-[#61756E]">14 Lakeview Residency, Bengaluru 560001</p></button><button className="rounded-[16px] border border-[#DFE7E3] p-4 text-left"><p className="font-bold">Office</p><p className="mt-2 text-sm leading-6 text-[#61756E]">82 Indiranagar Main Road, Bengaluru</p></button></div></div> : null}
                {checkoutStep === 2 ? <div><h2 className="text-lg font-semibold">Delivery method</h2><div className="mt-4 space-y-3">{[['Standard', 'Free · 2-3 days'], ['Express', '$6 · Tomorrow'], ['Same Day', '$10 · Today by 9 PM']].map(([name, detail], index) => <button key={name} className={cn('flex w-full items-center justify-between rounded-[16px] border p-4 text-left', index === 0 ? 'border-[#1F5C4A] bg-[#F4F7F5]' : 'border-[#DFE7E3]')}><span className="font-bold">{name}</span><span className="text-sm text-[#61756E]">{detail}</span></button>)}</div></div> : null}
                {checkoutStep === 3 ? <div><h2 className="text-lg font-semibold">Payment</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{[...paymentMethods, { name: 'Google Pay', detail: 'Fast wallet payment' }, { name: 'PhonePe', detail: 'UPI wallet' }, { name: 'Debit Card', detail: 'All major banks' }].map((method) => <button key={method.name} onClick={() => setCheckoutMethod(method.name)} className={cn('rounded-[16px] border p-4 text-left', checkoutMethod === method.name ? 'border-[#1F5C4A] bg-[#F4F7F5]' : 'border-[#DFE7E3]')}><p className="font-bold">{method.name}</p><p className="mt-1 text-xs text-[#71837D]">{method.detail}</p></button>)}</div></div> : null}
                {checkoutStep === 4 ? <div><h2 className="text-lg font-semibold">Review order</h2><div className="mt-4 space-y-3">{cartItems.map((item) => <div key={item.id} className="flex items-center gap-3 border-b border-[#E5ECE8] pb-3"><img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="flex-1"><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-[#71837D]">Qty {item.quantity}</p></div><p className="font-bold">${item.price * item.quantity}</p></div>)}</div><div className="mt-5 flex justify-between text-lg font-semibold"><span>Total</span><span>${cartSummary.total}</span></div></div> : null}
                <div className="mt-7 flex justify-between gap-3"><button type="button" disabled={checkoutStep === 1} onClick={() => setCheckoutStep((step) => Math.max(1, step - 1))} className="rounded-xl border border-[#DFE7E3] px-5 py-3 text-sm font-bold disabled:opacity-40">Back</button><button type="button" onClick={() => checkoutStep < 4 ? setCheckoutStep((step) => step + 1) : setActivePage('orders')} className="rounded-xl bg-[#1F5C4A] px-6 py-3 text-sm font-bold text-white">{checkoutStep < 4 ? 'Continue' : 'Place Order'}</button></div>
              </div>
            </motion.div>
          ) : null}

          {activePage === 'wishlist' ? <motion.div key="wishlist" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}><SectionTitle title="Your Wishlist" subtitle="Saved products and price-drop alerts" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{wishlistProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} onAdd={addToCart} wished onWishlist={toggleWishlist} />)}</div>{!wishlistProducts.length ? <div className="rounded-[20px] bg-white p-12 text-center text-[#61756E]">Your wishlist is ready for something special.</div> : null}</motion.div> : null}

          {activePage === 'orders' ? <motion.div key="orders" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><section><SectionTitle title="Your Orders" subtitle="Track, reorder and manage returns" /><div className="space-y-3">{orderHistory.map((order, index) => <button key={order.id} className={cn('w-full rounded-[18px] border bg-white p-4 text-left shadow-sm', index === 0 ? 'border-[#1F5C4A]' : 'border-white')}><div className="flex justify-between gap-3"><div><p className="font-semibold">{order.item}</p><p className="mt-1 text-xs text-[#71837D]">{order.id}</p></div><span className="h-fit rounded-full bg-[#E6ECEA] px-3 py-1 text-xs font-bold text-[#1F5C4A]">{order.status}</span></div><div className="mt-4 flex justify-between text-sm"><span className="text-[#61756E]">{order.eta}</span><span className="font-bold">{order.total}</span></div></button>)}</div></section><section className="rounded-[20px] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase text-[#71837D]">Live tracking</p><h2 className="mt-2 text-xl font-semibold">Nova Noise Buds</h2><p className="mt-1 text-sm text-[#61756E]">Order NH-2013 · Arrives tomorrow</p></div><span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">Shipped</span></div><div className="mt-8 grid grid-cols-4 gap-1">{orderTimeline.map((step, index) => <div key={step} className="text-center"><div className={cn('mx-auto grid h-9 w-9 place-items-center rounded-full text-xs font-bold', index < 2 ? 'bg-[#1F5C4A] text-white' : 'bg-[#E6ECEA] text-[#71837D]')}>{index + 1}</div><div className={cn('mx-auto mt-2 h-1 rounded-full', index < 1 ? 'bg-[#1F5C4A]' : 'bg-[#E6ECEA]')} /><p className="mt-2 text-[10px] font-bold text-[#61756E] sm:text-xs">{step}</p></div>)}</div><div className="mt-7 grid min-h-[220px] place-items-center rounded-[18px] border border-dashed border-[#CAD8D2] bg-[#F4F7F5]"><div className="text-center"><MobileGlyph name="map" className="mx-auto h-8 w-8 text-[#1F5C4A]" /><p className="mt-3 text-sm font-bold">Delivery map</p><p className="mt-1 text-xs text-[#71837D]">Package reached Bengaluru Central Hub</p></div></div></section></motion.div> : null}

          {activePage === 'rewards' ? <motion.div key="rewards" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5"><section className="rounded-[24px] bg-[#1F3B34] p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9D7D2]">Nasou Rewards</p><div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-5xl font-semibold">{rewardSummary.points}</p><p className="mt-2 text-sm text-[#C9D7D2]">points available · Gold Member</p></div><div className="rounded-[16px] bg-white/10 p-4"><p className="text-sm font-bold">Platinum is close</p><p className="mt-1 text-xs text-[#C9D7D2]">Earn 720 more points</p></div></div></section><div className="grid gap-4 md:grid-cols-3">{['Silver', 'Gold', 'Platinum'].map((tier, index) => <div key={tier} className={cn('rounded-[20px] border p-5', index === 1 ? 'border-[#1F5C4A] bg-white shadow-lg' : 'border-white/70 bg-white/70')}><p className="text-lg font-semibold">{tier}</p><p className="mt-2 text-sm text-[#61756E]">{['Free delivery perks', '2x points and priority support', '3x points and exclusive launches'][index]}</p></div>)}</div><section><SectionTitle title="Your Coupons" subtitle="Ready to use on your next purchase" /><div className="grid gap-3 sm:grid-cols-3">{rewardSummary.coupons.map((coupon) => <div key={coupon} className="rounded-[18px] border border-dashed border-[#1F5C4A] bg-white p-5"><p className="text-lg font-bold text-[#1F5C4A]">{coupon}</p><p className="mt-2 text-xs text-[#71837D]">Tap to apply at checkout</p></div>)}</div></section></motion.div> : null}

          {activePage === 'profile' ? <motion.div key="profile" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-5"><section className="flex flex-col gap-5 rounded-[24px] bg-[#1F5C4A] p-6 text-white sm:flex-row sm:items-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-white text-xl font-black text-[#1F5C4A]">AR</span><div><h1 className="text-2xl font-semibold">Aarav Rami</h1><p className="mt-1 text-sm text-[#D5E5DF]">{rewardSummary.tier} · {rewardSummary.points} points</p></div></section><div className="grid gap-4 md:grid-cols-2">{profileSections.map((section) => <div key={section.title} className="rounded-[18px] bg-white p-5 shadow-sm"><p className="font-semibold">{section.title}</p><p className="mt-2 text-sm leading-6 text-[#61756E]">{section.body}</p><button className="mt-4 text-xs font-bold text-[#1F5C4A]">Manage</button></div>)}</div><section className="rounded-[18px] bg-white p-5"><p className="font-semibold">Help &amp; Support</p><div className="mt-4 space-y-3">{faqs.map((faq) => <details key={faq.q} className="rounded-xl bg-[#F4F7F5] p-4"><summary className="cursor-pointer text-sm font-bold">{faq.q}</summary><p className="mt-2 text-sm leading-6 text-[#61756E]">{faq.a}</p></details>)}</div></section><button onClick={() => navigate('/app/auth', { replace: true })} className="rounded-xl bg-[#1F5C4A] px-6 py-3 text-sm font-bold text-white">Logout</button></motion.div> : null}
        </AnimatePresence>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/92 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_34px_rgba(37,88,73,0.14)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">{navItems.map(([key, label, icon]) => <button key={key} onClick={() => setActivePage(key)} className={cn('flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[14px] text-[11px] font-bold', activePage === key ? 'bg-[#1F5C4A] text-white' : 'text-[#61756E]')}>{icon === 'heart' ? <CustomerIcon name="heart" className="h-5 w-5" /> : <MobileGlyph name={icon} className="h-5 w-5" />}<span>{label}</span></button>)}</div>
      </nav>

      <AnimatePresence>
        {productOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProductOpen(false)} className="fixed inset-0 z-50 grid place-items-center bg-[#173D33]/35 p-3 backdrop-blur-md"><motion.section initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[24px] bg-[#F7F9F8] p-4 shadow-[0_32px_90px_rgba(31,59,52,0.28)] sm:p-6"><div className="flex justify-end"><button onClick={() => setProductOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl">&times;</button></div><div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]"><div><img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-square w-full rounded-[20px] object-cover" /><div className="mt-3 grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((item) => <img key={item} src={selectedProduct.image} alt="" className="aspect-square rounded-xl object-cover opacity-80" />)}</div></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#71837D]">{selectedProduct.category}</p><h2 className="mt-2 text-3xl font-semibold text-[#1F3B34]">{selectedProduct.name}</h2><div className="mt-3 flex items-center gap-2 text-sm"><CustomerIcon name="star" className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-bold">{selectedProduct.rating}</span><span className="text-[#71837D]">{selectedProduct.reviews} verified reviews</span></div><div className="mt-5 flex items-end gap-3"><p className="text-3xl font-semibold">${selectedProduct.price}</p>{selectedProduct.originalPrice ? <p className="pb-1 text-sm text-[#84938E] line-through">${selectedProduct.originalPrice}</p> : null}</div><p className="mt-4 text-sm leading-6 text-[#61756E]">A verified product supplied by {selectedProduct.supplier} through the Nasou Hive retail network. Quality checked, traceable and return eligible.</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-[14px] bg-white p-4"><p className="text-xs text-[#71837D]">Availability</p><p className="mt-1 font-bold text-emerald-600">{selectedProduct.inStock ? 'In Stock' : 'Back soon'}</p></div><div className="rounded-[14px] bg-white p-4"><p className="text-xs text-[#71837D]">Delivery</p><p className="mt-1 font-bold">{selectedProduct.sameDay ? 'Today by 9 PM' : '2-3 business days'}</p></div></div><div className="mt-5 flex gap-3"><button onClick={() => addToCart(selectedProduct)} className="flex-1 rounded-xl bg-[#1F5C4A] px-5 py-3 text-sm font-bold text-white">Add to Cart</button><button onClick={() => { addToCart(selectedProduct); setProductOpen(false); setActivePage('checkout'); }} className="flex-1 rounded-xl border border-[#1F5C4A] px-5 py-3 text-sm font-bold text-[#1F5C4A]">Buy Now</button><button onClick={() => toggleWishlist(selectedProduct)} className="grid h-12 w-12 place-items-center rounded-xl bg-white"><CustomerIcon name="heart" className={cn('h-5 w-5', wishlist.includes(selectedProduct.id) && 'fill-rose-500 text-rose-500')} /></button></div><div className="mt-7 border-t border-[#DFE7E3] pt-5"><p className="font-semibold">Compare Retailers</p><div className="mt-3 overflow-hidden rounded-[14px] border border-[#DFE7E3] bg-white">{[[selectedProduct.supplier, selectedProduct.price, 'Today', selectedProduct.rating, 'Best match'], ['Metro Select', selectedProduct.price + 4, 'Tomorrow', Math.max(4.4, selectedProduct.rating - 0.2).toFixed(1), 'Fast delivery'], ['Value Basket', Math.max(1, selectedProduct.price - 2), '2-3 days', Math.max(4.3, selectedProduct.rating - 0.3).toFixed(1), 'Lowest price']].map((row) => <div key={row[0]} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[#EDF1EF] px-4 py-3 text-sm last:border-b-0"><div><p className="font-bold">{row[0]}</p><p className="mt-0.5 text-xs text-[#71837D]">{row[2]} · {row[3]} rating</p></div><span className="rounded-full bg-[#E6ECEA] px-2 py-1 text-[10px] font-bold text-[#1F5C4A]">{row[4]}</span><span className="font-bold">${row[1]}</span></div>)}</div></div><div className="mt-7 border-t border-[#DFE7E3] pt-5"><p className="font-semibold">Ratings &amp; Reviews</p><div className="mt-3 rounded-[14px] bg-white p-4"><div className="flex items-center justify-between"><div><p className="font-bold">Excellent quality and quick delivery</p><p className="mt-1 text-xs text-[#71837D]">Verified Purchase · Anika S.</p></div><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">5.0</span></div></div></div></div></div></motion.section></motion.div> : null}
        {noticeOpen ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNoticeOpen(false)} className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"><motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} onClick={(e) => e.stopPropagation()} className="ml-auto h-full w-full max-w-md bg-[#F7F9F8] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Notifications</h2><button onClick={() => setNoticeOpen(false)} className="text-xl">&times;</button></div><div className="mt-6 space-y-3">{['Your order NH-2013 has shipped.', 'Nova Noise Buds dropped by $12.', 'You earned 240 Nasou Points.', 'Festival sale starts tomorrow.'].map((notice, index) => <div key={notice} className="rounded-[16px] bg-white p-4"><p className="text-sm font-bold">{notice}</p><p className="mt-1 text-xs text-[#71837D]">{index + 1} hour ago</p></div>)}</div></motion.aside></motion.div> : null}
      </AnimatePresence>
    </div>
  );
}

export default CustomerPortal;
