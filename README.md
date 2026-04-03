# Nasou

## Setup Instructions

The repository already contains a Vite React app with the landing page at `/`.
The new marketplace/dashboard flow is added under `/app` so the landing page remains unchanged.

### 1) Install dependencies

```bash
npm install
npm install framer-motion react-router-dom chart.js react-chartjs-2
npm install -D tailwindcss postcss autoprefixer
```

### 2) Tailwind config

`tailwind.config.js` has been added with the requested theme extension and animations.

### 3) Run the app

```bash
npm run dev
```

Open:
- `http://localhost:5173/` for the existing landing page
- `http://localhost:5173/app` for the role selection and app flow

## Added App Structure

```text
src/
+-- components/
¦   +-- GlassCard.jsx
¦   +-- ProductCard.jsx
¦   +-- Sidebar.jsx
¦   +-- TopNavbar.jsx
¦   +-- SearchBar.jsx
¦   +-- FilterPanel.jsx
¦   +-- CartDrawer.jsx
¦   +-- OrderTimeline.jsx
¦   +-- Toast.jsx
¦   +-- LoadingSkeleton.jsx
¦   +-- ChatbotWidget.jsx
¦   +-- Modal.jsx
¦   +-- AnimatedButton.jsx
¦   +-- SustainabilityMeter.jsx
+-- context/
¦   +-- AppContext.jsx
¦   +-- CartContext.jsx
+-- data/
¦   +-- mockData.js
+-- pages/
¦   +-- MarketplacePage.jsx
¦   +-- ProductDetailPage.jsx
¦   +-- CartPage.jsx
¦   +-- CheckoutPage.jsx
¦   +-- OrderTrackingPage.jsx
¦   +-- ManufacturerDashboard.jsx
¦   +-- RetailerDashboard.jsx
¦   +-- CustomerTraceabilityPage.jsx
¦   +-- RoleSelectionPage.jsx
+-- App.jsx (existing landing page)
+-- NasuoApp.jsx (new app routes)
+-- main.jsx
+-- index.css
```
