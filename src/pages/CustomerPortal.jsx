import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  bestDeals,
  customerCategories,
  customerNavItems,
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
import { cn, CustomerIcon, EmptyState, PortalCard, ProductTile } from '../components/customer/CustomerUI';

const allProducts = [...recommendedProducts, ...trendingProducts, ...recentlyViewed];

const openGoogleMaps = (locationValue = '') => {
  const query = String(locationValue ?? '').trim();
  const url = query ? `https://www.google.com/maps/search/${encodeURIComponent(query)}` : 'https://www.google.com/maps';
  window.open(url, '_blank', 'noopener,noreferrer');
};

function CustomerPortal() {
  const [activePage, setActivePage] = useState('home');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('EN');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');
  const [selectedProduct, setSelectedProduct] = useState(trendingProducts[0]);
  const [cartItems, setCartItems] = useState([trendingProducts[0], recommendedProducts[1]]);
  const [wishlist, setWishlist] = useState([recommendedProducts[2], trendingProducts[2]]);
  const [checkoutMethod, setCheckoutMethod] = useState('UPI');
  const [address, setAddress] = useState('Home · 14 Lakeview Residency, Bengaluru');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let items = allProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') items = items.filter((item) => item.category === category);
    if (sortBy === 'Price low -> high') items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === 'Rating') items = [...items].sort((a, b) => b.rating - a.rating);
    return items;
  }, [search, category, sortBy]);

  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price), 0);
    return { subtotal, discount, total: subtotal };
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setActivePage('cart');
  };

  const shellBg = 'bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.18),transparent_22%),radial-gradient(circle_at_top_right,rgba(229,216,199,0.55),transparent_18%),linear-gradient(180deg,#EFEAE1_0%,#EFE7DA_100%)]';

  const navButton = (item) =>
    cn(
      'flex w-full items-center gap-3 rounded-[18px] border border-transparent px-4 py-3 text-sm font-bold tracking-[0.01em] transition',
      activePage === item.key
        ? 'text-[#1F5C4A] shadow-[inset_4px_0_0_#1F5C4A]'
        : 'text-[#255849] hover:text-[#1F5C4A] hover:shadow-[inset_4px_0_0_#255849]',
    );

  return (
    <div className={cn('min-h-screen bg-[#EFE7DA]', shellBg)}>
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#E5D8C7] bg-[#EFEAE1] px-4 py-5 backdrop-blur-xl lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#255849] bg-[#1F5C4A] text-white shadow-[0_14px_34px_rgba(31,92,74,0.3)]">N</div>
            <div>
              <p className="font-bold text-[#1F5C4A]">Nasuo Hive</p>
              <p className="text-xs font-semibold text-[#255849]">Customer Portal</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {customerNavItems.map((item) => (
              <button key={item.key} onClick={() => setActivePage(item.key)} className={navButton(item)}>
                <CustomerIcon name={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <PortalCard className="mt-8 border-[#FFFFFF]/10 bg-[linear-gradient(135deg,#1F5C4A,#255849)] text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-[#E6ECEA]">Loyalty</p>
            <p className="mt-3 text-3xl font-semibold">{rewardSummary.points}</p>
            <p className="mt-2 text-sm text-[#E6ECEA]">{rewardSummary.tier}</p>
          </PortalCard>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#E5D8C7] bg-[#FFFFFF]/85 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen((prev) => !prev)} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-3 text-[#1F5C4A] lg:hidden">
                  <CustomerIcon name="grid" className="h-5 w-5" />
                </button>
                <div className="flex flex-1 items-center gap-3 rounded-[22px] border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 shadow-[0_12px_30px_rgba(37,88,73,0.08)]">
                  <CustomerIcon name="search" className="h-5 w-5 text-[#255849]" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, suppliers, and categories" className="w-full bg-transparent text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]/60" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 text-sm text-[#1F5C4A]">
                  <option>All</option>
                  {customerCategories.map((item) => <option key={item.name}>{item.name}</option>)}
                </select>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 text-sm text-[#1F5C4A]">
                  <option>EN</option><option>HI</option><option>TE</option>
                </select>
                <button onClick={() => setActivePage('cart')} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-3 text-[#1F5C4A]"><CustomerIcon name="cart" className="h-5 w-5" /></button>
                <button className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-3 text-[#1F5C4A]"><CustomerIcon name="bell" className="h-5 w-5" /></button>
                <button onClick={() => setActivePage('settings')} className="flex items-center gap-3 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-3 py-2">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#E5D8C7] text-[#1F5C4A]">AR</div>
                  <span className="hidden text-sm font-semibold text-[#1F5C4A] md:block">Aarav</span>
                </button>
              </div>
            </div>
          </header>

          <AnimatePresence>
            {sidebarOpen ? (
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="fixed inset-y-0 left-0 z-40 w-[260px] border-r border-[#E5D8C7] bg-[#EFEAE1] px-4 py-5 backdrop-blur-xl lg:hidden">
                <div className="mb-6 flex items-center justify-between">
                  <p className="font-bold text-[#1F5C4A]">Nasuo Hive</p>
                  <button onClick={() => setSidebarOpen(false)} className="rounded-xl bg-[#1F5C4A] px-3 py-2 text-sm text-white">Close</button>
                </div>
                <div className="space-y-1.5">
                  {customerNavItems.map((item) => (
                    <button key={item.key} onClick={() => { setActivePage(item.key); setSidebarOpen(false); }} className={navButton(item)}>
                      <CustomerIcon name={item.icon} className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-[1500px] space-y-6">
              {activePage === 'home' && (
                <>
                  <PortalCard className="overflow-hidden border-[#1F5C4A] bg-[linear-gradient(135deg,#1F5C4A_0%,#255849_58%,#E5D8C7_180%)] text-white">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#E6ECEA]">Unified Commerce</p>
                        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Shop smarter across multiple suppliers</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-[#E6ECEA]">A next-gen customer experience that merges supplier transparency, AI recommendations, order tracking, and rewards into one premium portal.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                          <button onClick={() => setActivePage('categories')} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1F5C4A]">Explore Products</button>
                          <button onClick={() => setActivePage('offers')} className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white">View Deals</button>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <PortalCard className="bg-white/14 text-white backdrop-blur-md"><p className="text-sm text-[#E6ECEA]">AI savings this month</p><p className="mt-3 text-3xl font-semibold">$186</p></PortalCard>
                        <PortalCard className="bg-white/14 text-white backdrop-blur-md"><p className="text-sm text-[#E6ECEA]">Active suppliers</p><p className="mt-3 text-3xl font-semibold">48</p></PortalCard>
                        <PortalCard className="bg-white/14 text-white backdrop-blur-md"><p className="text-sm text-[#E6ECEA]">Rewards tier</p><p className="mt-3 text-3xl font-semibold">{rewardSummary.tier}</p></PortalCard>
                        <PortalCard className="bg-white/14 text-white backdrop-blur-md"><p className="text-sm text-[#E6ECEA]">Fast delivery coverage</p><p className="mt-3 text-3xl font-semibold">92%</p></PortalCard>
                      </div>
                    </div>
                  </PortalCard>

                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1F5C4A]">Recommended Products</h2><button onClick={() => setActivePage('categories')} className="text-sm font-semibold text-[#1F5C4A]">See all</button></div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {recommendedProducts.map((product) => <ProductTile key={product.id} product={product} onOpen={(item) => { setSelectedProduct(item); setActivePage('product'); }} onAdd={addToCart} />)}
                    </div>
                  </section>

                  <section className="grid gap-4 lg:grid-cols-3">
                    {bestDeals.map((deal) => (
                      <PortalCard key={deal.title} className="relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top right, ${deal.accent}, transparent 38%)` }} />
                        <p className="text-sm text-[#255849]">Best deals</p>
                        <h3 className="mt-2 text-xl font-semibold text-[#1F5C4A]">{deal.title}</h3>
                        <p className="mt-2 text-sm text-[#255849]">{deal.subtitle}</p>
                        <div className="mt-6 inline-flex rounded-full bg-[#E6ECEA] px-3 py-1.5 text-xs font-semibold text-[#1F5C4A]">{deal.code}</div>
                      </PortalCard>
                    ))}
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1F5C4A]">Categories</h2><button onClick={() => setActivePage('categories')} className="text-sm font-semibold text-[#1F5C4A]">Browse all</button></div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {customerCategories.map((item) => (
                        <button key={item.name} onClick={() => { setCategory(item.name); setActivePage('categories'); }} className="rounded-[22px] border border-[#E5D8C7] bg-[#FFFFFF] p-5 text-left shadow-[0_16px_34px_rgba(37,88,73,0.08)]">
                          <div className="flex items-center justify-between"><h3 className="text-xl font-semibold text-[#1F5C4A]">{item.name}</h3><div className="h-12 w-12 rounded-[18px]" style={{ background: `linear-gradient(135deg, ${item.accent}, #FFFFFF)` }} /></div>
                          <p className="mt-3 text-sm text-[#255849]">{item.count}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1F5C4A]">Trending Products</h2><button onClick={() => setActivePage('categories')} className="text-sm font-semibold text-[#1F5C4A]">View listing</button></div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {trendingProducts.map((product) => <ProductTile key={product.id} product={product} onOpen={(item) => { setSelectedProduct(item); setActivePage('product'); }} onAdd={addToCart} />)}
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1F5C4A]">Recently Viewed</h2><button onClick={() => setActivePage('wishlist')} className="text-sm font-semibold text-[#1F5C4A]">Open wishlist</button></div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {recentlyViewed.map((product) => <ProductTile key={product.id} product={product} onOpen={(item) => { setSelectedProduct(item); setActivePage('product'); }} onAdd={addToCart} />)}
                    </div>
                  </section>
                </>
              )}

              {activePage === 'categories' && (
                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                  <PortalCard>
                    <h2 className="text-xl font-semibold text-[#1F5C4A]">Filters</h2>
                    <div className="mt-5 space-y-5">
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Price range</p><input type="range" className="mt-3 w-full accent-[#1F5C4A]" /></div>
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Category</p><div className="mt-3 flex flex-wrap gap-2">{['All', ...customerCategories.map((item) => item.name)].map((item) => <button key={item} onClick={() => setCategory(item)} className={cn('rounded-full px-3 py-2 text-xs font-semibold', category === item ? 'bg-[#1F5C4A] text-white' : 'bg-[#EFEAE1] text-[#1F5C4A]')}>{item}</button>)}</div></div>
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Rating</p><div className="mt-3 flex gap-2">{['4.5+', '4.0+', '3.5+'].map((item) => <div key={item} className="rounded-full bg-[#EFEAE1] px-3 py-2 text-xs font-semibold text-[#1F5C4A]">{item}</div>)}</div></div>
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Availability</p><div className="mt-3 space-y-2 text-sm text-[#255849]"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> In Stock</label><label className="flex items-center gap-2"><input type="checkbox" /> Same Day</label></div></div>
                    </div>
                  </PortalCard>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><h2 className="text-2xl font-semibold text-[#1F5C4A]">Product Listing</h2><p className="mt-1 text-sm text-[#255849]">{filteredProducts.length} products ready to explore</p></div>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 text-sm text-[#1F5C4A]">
                        <option>Popularity</option><option>Price low to high</option><option>Rating</option>
                      </select>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts.map((product) => <ProductTile key={`${product.id}-${product.name}`} product={product} onOpen={(item) => { setSelectedProduct(item); setActivePage('product'); }} onAdd={addToCart} />)}
                    </div>
                  </div>
                </div>
              )}

              {activePage === 'product' && (
                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <PortalCard>
                    <div className="grid gap-4">
                      <div className="grid min-h-[360px] place-items-center rounded-[22px] bg-[linear-gradient(135deg,#EFEAE1,#FFFFFF)]" style={{ boxShadow: `inset 0 0 0 1px ${selectedProduct.accent}22` }}>
                        <div className="h-36 w-36 rounded-[36px] border border-white/60 bg-white/70 shadow-[0_20px_40px_rgba(24,53,44,0.08)]" />
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((item) => <div key={item} className="h-20 rounded-[18px] border border-white/60 bg-white/70" />)}
                      </div>
                    </div>
                  </PortalCard>
                  <div className="space-y-6">
                    <PortalCard>
                      <p className="text-sm text-[#255849]">{selectedProduct.category}</p>
                      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1F5C4A]">{selectedProduct.name}</h1>
                      <div className="mt-3 flex items-center gap-3 text-sm text-[#255849]"><CustomerIcon name="star" className="h-4 w-4 fill-[#E5D8C7] text-[#E5D8C7]" /><span>{selectedProduct.rating} rating</span><span>{selectedProduct.reviews} reviews</span></div>
                      <div className="mt-5 flex items-end gap-3"><p className="text-3xl font-semibold text-[#1F5C4A]">${selectedProduct.price}</p>{selectedProduct.originalPrice ? <p className="pb-1 text-sm text-[#255849] line-through">${selectedProduct.originalPrice}</p> : null}</div>
                      <p className="mt-4 text-sm leading-7 text-[#255849]">Designed for customers who want premium quality, transparent supplier access, and fast fulfillment across the Nasuo Hive ecosystem.</p>
                      <div className="mt-5 rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
                        <p className="text-sm font-semibold text-[#1F5C4A]">Supplier info</p>
                        <p className="mt-2 text-sm text-[#255849]">{selectedProduct.supplier} · Verified seller · 2-day dispatch</p>
                      </div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button onClick={() => addToCart(selectedProduct)} className="rounded-full bg-[#1F5C4A] px-5 py-3 text-sm font-semibold text-white">Add to Cart</button>
                        <button onClick={() => setActivePage('checkout')} className="rounded-full border border-[#1F5C4A] px-5 py-3 text-sm font-semibold text-[#1F5C4A]">Buy Now</button>
                      </div>
                    </PortalCard>
                    <PortalCard>
                      <h2 className="text-xl font-semibold text-[#1F5C4A]">Compare suppliers</h2>
                      <div className="mt-4 space-y-3">
                        {[selectedProduct.supplier, 'Warehouse Direct', 'Prime Retail'].map((seller, index) => (
                          <div key={seller} className="flex items-center justify-between rounded-[18px] border border-[#E5D8C7] bg-white/70 px-4 py-4">
                            <div><p className="font-semibold text-[#1F5C4A]">{seller}</p><p className="mt-1 text-sm text-[#255849]">{index === 0 ? 'Fastest match' : index === 1 ? 'Best price' : 'Highest rating'}</p></div>
                            <p className="font-semibold text-[#1F5C4A]">${selectedProduct.price + index * 3}</p>
                          </div>
                        ))}
                      </div>
                    </PortalCard>
                    <PortalCard>
                      <h2 className="text-xl font-semibold text-[#1F5C4A]">Similar products</h2>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {recommendedProducts.slice(0, 2).map((product) => <ProductTile key={product.id} product={product} onOpen={setSelectedProduct} onAdd={addToCart} />)}
                      </div>
                    </PortalCard>
                  </div>
                </div>
              )}

              {activePage === 'cart' && (
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <PortalCard>
                    <h2 className="text-2xl font-semibold text-[#1F5C4A]">Cart</h2>
                    <div className="mt-5 space-y-4">
                      {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex flex-col gap-4 rounded-[20px] border border-[#E5D8C7] bg-white/70 p-4 sm:flex-row sm:items-center">
                          <div className="h-20 w-20 rounded-[20px] bg-[linear-gradient(135deg,#EFEAE1,#FFFFFF)]" />
                          <div className="flex-1">
                            <p className="font-semibold text-[#1F5C4A]">{item.name}</p>
                            <p className="mt-1 text-sm text-[#255849]">{item.supplier}</p>
                            <p className="mt-2 text-sm font-semibold text-[#1F5C4A]">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-[#EFEAE1] px-3 py-2"><button className="text-sm font-semibold">-</button><span className="text-sm font-semibold">1</span><button className="text-sm font-semibold">+</button></div>
                        </div>
                      ))}
                    </div>
                  </PortalCard>
                  <PortalCard>
                    <h2 className="text-xl font-semibold text-[#1F5C4A]">Price summary</h2>
                    <div className="mt-5 space-y-3 text-sm text-[#255849]">
                      <div className="flex justify-between"><span>Subtotal</span><span>${cartSummary.subtotal}</span></div>
                      <div className="flex justify-between"><span>Discounts</span><span>-${cartSummary.discount}</span></div>
                      <div className="flex justify-between"><span>Delivery</span><span>Free</span></div>
                      <div className="mt-3 border-t border-[#E5D8C7] pt-3 text-base font-semibold text-[#1F5C4A]"><div className="flex justify-between"><span>Total</span><span>${cartSummary.total}</span></div></div>
                    </div>
                    <button onClick={() => setActivePage('checkout')} className="mt-6 w-full rounded-full bg-[#1F5C4A] px-5 py-3 text-sm font-semibold text-white">Checkout</button>
                  </PortalCard>
                </div>
              )}

              {activePage === 'checkout' && (
                <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
                  <PortalCard>
                    <h2 className="text-2xl font-semibold text-[#1F5C4A]">Checkout</h2>
                    <div className="mt-6 space-y-6">
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Address selection</p><div className="mt-3 rounded-[18px] border border-[#E5D8C7] bg-white/70 p-4"><input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 text-sm font-medium text-[#1F5C4A] outline-none focus:border-[#1F5C4A]" placeholder="Type delivery address" /><button type="button" onClick={() => openGoogleMaps(address)} className="mt-3 rounded-xl border border-[#255849] bg-[#E5D8C7] px-4 py-2 text-sm font-bold text-[#1F5C4A] transition hover:bg-[#E6ECEA]">Open in Google Maps</button></div></div>
                      <div><p className="text-sm font-semibold text-[#1F5C4A]">Payment methods</p><div className="mt-3 grid gap-3">{paymentMethods.map((method) => <button key={method.name} onClick={() => setCheckoutMethod(method.name)} className={cn('rounded-[18px] border px-4 py-4 text-left', checkoutMethod === method.name ? 'border-[#1F5C4A] bg-[#E6ECEA]' : 'border-[#E5D8C7] bg-white/70')}><p className="font-semibold text-[#1F5C4A]">{method.name}</p><p className="mt-1 text-sm text-[#255849]">{method.detail}</p></button>)}</div></div>
                    </div>
                  </PortalCard>
                  <PortalCard>
                    <h2 className="text-xl font-semibold text-[#1F5C4A]">Order summary</h2>
                    <div className="mt-5 space-y-3">{cartItems.map((item, index) => <div key={`${item.id}-summary-${index}`} className="flex items-center justify-between text-sm text-[#255849]"><span>{item.name}</span><span>${item.price}</span></div>)}</div>
                    <div className="mt-5 border-t border-[#E5D8C7] pt-4 text-sm text-[#255849]"><div className="flex justify-between"><span>Total</span><span className="text-base font-semibold text-[#1F5C4A]">${cartSummary.total}</span></div></div>
                    <button onClick={() => setActivePage('orders')} className="mt-6 w-full rounded-full bg-[#1F5C4A] px-5 py-3 text-sm font-semibold text-white">Place Order</button>
                  </PortalCard>
                </div>
              )}

              {activePage === 'orders' && (
                <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                  <PortalCard>
                    <h2 className="text-2xl font-semibold text-[#1F5C4A]">Orders</h2>
                    <div className="mt-5 space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="rounded-[20px] border border-[#E5D8C7] bg-white/70 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-[#1F5C4A]">{order.item}</p><p className="mt-1 text-sm text-[#255849]">{order.id}</p></div><div className="rounded-full bg-[#E6ECEA] px-3 py-1 text-xs font-semibold text-[#1F5C4A]">{order.status}</div></div>
                          <div className="mt-3 flex items-center justify-between text-sm text-[#255849]"><span>{order.total}</span><span>{order.eta}</span></div>
                        </div>
                      ))}
                    </div>
                  </PortalCard>
                  <PortalCard>
                    <h2 className="text-xl font-semibold text-[#1F5C4A]">Track order</h2>
                    <div className="mt-6 space-y-4">
                      {orderTimeline.map((step, index) => (
                        <div key={step} className="flex items-start gap-4">
                          <div className={cn('mt-1 h-4 w-4 rounded-full', index < 3 ? 'bg-[#1F5C4A]' : 'bg-[#E5D8C7]')} />
                          <div>
                            <p className="font-medium text-[#1F5C4A]">{step}</p>
                            <p className="mt-1 text-sm text-[#255849]">{index < 3 ? 'Completed update recorded in the customer timeline.' : 'Pending completion'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PortalCard>
                </div>
              )}

              {activePage === 'wishlist' && (
                <div>{wishlist.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{wishlist.map((product) => <ProductTile key={`wish-${product.id}`} product={product} onOpen={(item) => { setSelectedProduct(item); setActivePage('product'); }} onAdd={addToCart} />)}</div> : <EmptyState title="Your wishlist is empty" detail="Save products here to revisit them later." />}</div>
              )}

              {activePage === 'payments' && (
                <PortalCard>
                  <h2 className="text-2xl font-semibold text-[#1F5C4A]">Payments</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">{paymentMethods.map((method) => <PortalCard key={method.name} className="bg-white/70"><p className="font-semibold text-[#1F5C4A]">{method.name}</p><p className="mt-2 text-sm text-[#255849]">{method.detail}</p></PortalCard>)}</div>
                </PortalCard>
              )}

              {activePage === 'offers' && (
                <div className="grid gap-4 md:grid-cols-3">{bestDeals.map((deal) => <PortalCard key={deal.title}><p className="text-sm text-[#255849]">Offer</p><h3 className="mt-2 text-xl font-semibold text-[#1F5C4A]">{deal.title}</h3><p className="mt-2 text-sm text-[#255849]">{deal.subtitle}</p><div className="mt-5 inline-flex rounded-full bg-[#E6ECEA] px-3 py-1.5 text-xs font-semibold text-[#1F5C4A]">{deal.code}</div></PortalCard>)}</div>
              )}

              {activePage === 'support' && (
                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                  <PortalCard>
                    <h2 className="text-2xl font-semibold text-[#1F5C4A]">Support & Help Center</h2>
                    <div className="mt-5 space-y-4">{faqs.map((item) => <div key={item.q} className="rounded-[18px] border border-[#E5D8C7] bg-white/70 p-4"><p className="font-semibold text-[#1F5C4A]">{item.q}</p><p className="mt-2 text-sm text-[#255849]">{item.a}</p></div>)}</div>
                  </PortalCard>
                  <PortalCard>
                    <h2 className="text-xl font-semibold text-[#1F5C4A]">Raise a ticket</h2>
                    <div className="mt-5 space-y-4">
                      <input className="w-full rounded-[18px] border border-[#E5D8C7] bg-white/80 px-4 py-3 text-sm outline-none" placeholder="Subject" />
                      <textarea className="min-h-[160px] w-full rounded-[18px] border border-[#E5D8C7] bg-white/80 px-4 py-3 text-sm outline-none" placeholder="Describe your issue" />
                      <button className="rounded-full bg-[#1F5C4A] px-5 py-3 text-sm font-semibold text-white">Submit ticket</button>
                    </div>
                  </PortalCard>
                </div>
              )}

              {activePage === 'settings' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {profileSections.map((section) => <PortalCard key={section.title}><p className="text-sm font-semibold text-[#1F5C4A]">{section.title}</p><p className="mt-3 text-sm leading-6 text-[#255849]">{section.body}</p></PortalCard>)}
                  <PortalCard><p className="text-sm font-semibold text-[#1F5C4A]">Reward points</p><p className="mt-3 text-3xl font-semibold text-[#1F5C4A]">{rewardSummary.points}</p><p className="mt-2 text-sm text-[#255849]">{rewardSummary.tier}</p></PortalCard>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerPortal;

