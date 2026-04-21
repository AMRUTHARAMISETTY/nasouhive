export const customerNavItems = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'categories', label: 'Categories', icon: 'grid' },
  { key: 'orders', label: 'Orders', icon: 'bag' },
  { key: 'wishlist', label: 'Wishlist', icon: 'heart' },
  { key: 'payments', label: 'Payments', icon: 'card' },
  { key: 'offers', label: 'Offers', icon: 'gift' },
  { key: 'support', label: 'Support', icon: 'help' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export const customerCategories = [
  { name: 'Groceries', accent: '#1F5C4A', count: '1.2k items' },
  { name: 'Electronics', accent: '#255849', count: '860 items' },
  { name: 'Home Living', accent: '#E5D8C7', count: '530 items' },
  { name: 'Beauty', accent: '#E6ECEA', count: '420 items' },
  { name: 'Wellness', accent: '#EFE7DA', count: '310 items' },
  { name: 'Accessories', accent: '#EFEAE1', count: '290 items' },
];

export const recommendedProducts = [
  { id: 1, name: 'Aero Smart Kettle', category: 'Electronics', price: 74, rating: 4.8, reviews: 248, supplier: 'Retailer One', badge: 'AI Pick', accent: '#1F5C4A' },
  { id: 2, name: 'Organic Pantry Box', category: 'Groceries', price: 29, rating: 4.9, reviews: 521, supplier: 'Fresh Basket', badge: 'Top Rated', accent: '#255849' },
  { id: 3, name: 'Luma Desk Lamp', category: 'Home Living', price: 49, rating: 4.7, reviews: 194, supplier: 'Urban Home', badge: 'Eco Saver', accent: '#E5D8C7' },
  { id: 4, name: 'Pure Mist Diffuser', category: 'Wellness', price: 39, rating: 4.6, reviews: 166, supplier: 'Calm Collective', badge: 'Wellness', accent: '#EFE7DA' },
];

export const trendingProducts = [
  { id: 5, name: 'Nova Noise Buds', category: 'Electronics', price: 119, originalPrice: 149, rating: 4.9, reviews: 892, supplier: 'Sound Loft', badge: '18% off', accent: '#1F5C4A' },
  { id: 6, name: 'Harvest Blend Coffee', category: 'Groceries', price: 18, originalPrice: 24, rating: 4.7, reviews: 410, supplier: 'Bean Theory', badge: 'Best Deal', accent: '#255849' },
  { id: 7, name: 'Cloud Weave Throw', category: 'Home Living', price: 56, originalPrice: 79, rating: 4.8, reviews: 204, supplier: 'House Foundry', badge: 'Limited', accent: '#E5D8C7' },
  { id: 8, name: 'Glow Skin Serum', category: 'Beauty', price: 42, originalPrice: 52, rating: 4.6, reviews: 300, supplier: 'Aster Care', badge: 'Trending', accent: '#E6ECEA' },
  { id: 9, name: 'MoveFit Bottle', category: 'Accessories', price: 22, originalPrice: 30, rating: 4.8, reviews: 115, supplier: 'Active Loop', badge: 'Popular', accent: '#EFEAE1' },
  { id: 10, name: 'Sleep Calm Tea', category: 'Wellness', price: 15, originalPrice: 19, rating: 4.5, reviews: 97, supplier: 'Herbal Hour', badge: 'New', accent: '#EFE7DA' },
];

export const bestDeals = [
  { title: 'Weekend essentials', subtitle: 'Up to 30% off groceries and wellness kits', code: 'WEEKEND30', accent: '#1F5C4A' },
  { title: 'Smart home edit', subtitle: 'Instant cashback on connected home products', code: 'HOMEPAY', accent: '#255849' },
  { title: 'Rewards booster', subtitle: '2x loyalty points on orders above $120', code: 'POINTS2X', accent: '#E5D8C7' },
];

export const recentlyViewed = [
  { id: 11, name: 'Stoneware Mug Set', category: 'Home Living', price: 34, rating: 4.6, reviews: 76, supplier: 'Clayline', accent: '#E5D8C7' },
  { id: 12, name: 'Cold Press Juice Pack', category: 'Groceries', price: 21, rating: 4.7, reviews: 118, supplier: 'Daily Press', accent: '#255849' },
  { id: 13, name: 'Portable Air Purifier', category: 'Electronics', price: 82, rating: 4.5, reviews: 64, supplier: 'Pure Grid', accent: '#1F5C4A' },
];

export const orderHistory = [
  { id: 'NH-2013', item: 'Nova Noise Buds', status: 'Shipped', total: '$119', eta: 'Arrives tomorrow' },
  { id: 'NH-2011', item: 'Organic Pantry Box', status: 'Delivered', total: '$29', eta: 'Delivered Apr 13' },
  { id: 'NH-2008', item: 'Luma Desk Lamp', status: 'Out for delivery', total: '$49', eta: 'Today by 8 PM' },
];

export const orderTimeline = ['Placed', 'Shipped', 'Out for delivery', 'Delivered'];

export const paymentMethods = [
  { name: 'UPI', detail: 'Fast one-tap checkout' },
  { name: 'Card', detail: 'Credit / debit / EMI supported' },
  { name: 'Cash on Delivery', detail: 'Available for selected locations' },
];

export const profileSections = [
  { title: 'User details', body: 'Aarav Reddy · aarav@nasouhive.com · +91 9XXXXXX291' },
  { title: 'Address management', body: '2 saved addresses · Home and Office' },
  { title: 'Saved payments', body: '1 Visa card · 1 UPI handle' },
  { title: 'Preferences', body: 'English · Dark mode off · Eco offers enabled' },
];

export const rewardSummary = {
  points: '4,280',
  tier: 'Gold Member',
  coupons: ['FREEDEL', 'SAVE12', 'NHSUMMER'],
};

export const faqs = [
  { q: 'How do I compare suppliers?', a: 'Open any product and use the compare suppliers panel to review seller pricing and estimated delivery windows.' },
  { q: 'Can I reorder from past purchases?', a: 'Yes, open Orders and use the quick reorder action on delivered items.' },
  { q: 'Where can I raise a support ticket?', a: 'Use the support page to create a ticket, attach notes, and view help center articles.' },
];
