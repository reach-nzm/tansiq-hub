# 🎉 Tansiq Hub - E-Commerce Store Setup Guide

Welcome to **Tansiq Hub** - A beautiful, Islamic-themed e-commerce platform built with Next.js 15, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd /home/nazim/Softwares/tansiq-hub
npm install
npm run dev
```

The application will be available at **http://localhost:3000**

---

## 👤 Demo Credentials

### Customer Account (Demo User)
- **Email:** `demo@tansiqhub.com`
- **Password:** `demo123`
- **Account Type:** Customer
- **Features:** Browse products, add to cart, checkout

### Admin Account
- **Email:** `admin@tansiqhub.com`
- **Password:** `(not configured in demo)`
- **Access:** `/admin` - Full admin dashboard

---

## 📍 Key Pages & URLs

### Public Pages
- **Home:** http://localhost:3000
- **Products:** http://localhost:3000/products
- **Product Detail:** http://localhost:3000/products/1 (example)
- **Cart:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout
- **About:** http://localhost:3000/about
- **Contact:** http://localhost:3000/contact
- **Login:** http://localhost:3000/login
- **Profile:** http://localhost:3000/profile

### Admin Pages (After Login)
- **Admin Dashboard:** http://localhost:3000/admin
- **Product Management:** http://localhost:3000/admin/products
- **Order Management:** http://localhost:3000/admin/orders
- **Customer Management:** http://localhost:3000/admin/customers
- **Analytics:** http://localhost:3000/admin/analytics
- **Category Management:** http://localhost:3000/admin/categories
- **Settings:** http://localhost:3000/admin/settings

---

## 🎯 Demo Workflow

### 1. Browse the Store
- Navigate to http://localhost:3000
- Explore the hero section, featured products, and categories
- Use the search functionality to find products
- Filter by price range and category

### 2. View Product Details
- Click any product to see:
  - Full product information
  - Multiple images
  - Customer reviews
  - Related products

### 3. Add to Cart
- Click "Add to Cart" button
- See cart count update in the header
- Navigate to `/cart` to review items

### 4. Checkout (with Demo Data)
- Go to http://localhost:3000/cart
- Click "Proceed to Checkout"
- Fill in shipping information
- Select shipping method (Standard/Express)
- Enter payment details (demo only - no real charges)
- Confirm order

### 5. Login as Demo User
1. Click the profile icon in the header or go to `/login`
2. Use credentials:
   - Email: `demo@tansiqhub.com`
   - Password: `demo123`
3. View your profile at `/profile`
4. See your order history
5. Edit profile information

### 6. Explore Admin Dashboard
Currently in read-only demo mode. Admin panel includes:
- **Dashboard:** Revenue charts, order stats, product analytics
- **Products:** View all products (CRUD operations enabled)
- **Orders:** View and manage orders with status tracking
- **Customers:** View all registered customers
- **Analytics:** Multi-chart analytics with trends
- **Categories:** Manage product categories
- **Settings:** Store configuration

---

## 🛍️ Sample Products (Pre-loaded)

### Organic Foods
- Organic Dates - Premium Medjool ($24.99)
- Raw Honey - Pure Acacia ($18.99)
- Herbal Tea - Chamomile Blend ($12.99)
- Organic Olive Oil - Extra Virgin ($34.99)

### Islamic Books
- Islamic History Encyclopedia ($45.99)
- Quran with Tafsir ($55.99)
- Islamic Philosophy Guide ($32.99)

### Fashion & Clothing
- Premium Hijab Collection ($19.99)
- Modest Abaya ($89.99)
- Thobe - Premium Quality ($79.99)

### Home & Decor
- Islamic Wall Art ($49.99)
- Prayer Mat - Beautifully Designed ($24.99)
- Quran Stand - Wooden ($39.99)

### Health & Beauty
- Organic Skincare Set ($42.99)
- Neem Oil Serum ($28.99)
- Natural Face Mask ($16.99)

---

## 🎨 Design Features

### Islamic Vibes
- ✅ Custom CSS with Islamic patterns and arabesques
- ✅ Green and gold color scheme (Islamic colors)
- ✅ Arabic text accents throughout
- ✅ Islamic pattern SVG backgrounds
- ✅ Smooth animations with Framer Motion

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tailwind CSS for styling
- ✅ Touch-friendly interface
- ✅ Optimized for all screen sizes

### Animations
- ✅ Page transitions
- ✅ Hover effects on buttons and cards
- ✅ Floating animations on elements
- ✅ Smooth scroll animations
- ✅ Loading states

---

## 📊 Technical Stack

```
Frontend:
- Next.js 15 (App Router with TypeScript)
- Tailwind CSS 3 (with Islamic theme variables)
- Framer Motion (animations)
- Lucide React (icons)

State Management:
- Zustand (with persist middleware)
- Local storage for cart persistence

Data Visualization:
- Recharts (for admin analytics)

Date Handling:
- date-fns (date formatting)
```

---

## 🔧 Key Features Implemented

### ✅ Storefront
- [x] Homepage with hero section and categories
- [x] Product listing with filters and search
- [x] Product detail pages
- [x] Shopping cart with persistence
- [x] Multi-step checkout process
- [x] Order confirmation
- [x] User profile and order history
- [x] About and Contact pages

### ✅ Admin Panel
- [x] Dashboard with analytics charts
- [x] Product CRUD operations
- [x] Order management with status tracking
- [x] Customer management
- [x] Advanced analytics with multiple charts
- [x] Category management
- [x] Settings page

### ✅ User Management
- [x] Demo user account (email/password login)
- [x] Profile management
- [x] Order history viewing
- [x] User data persistence

---

## 🐛 Fixes Applied

✅ **Fixed Issues:**
- TypeScript formatter error in analytics page
- Removed broken wishlist link
- Added demo user functionality
- Created login and profile pages
- Updated header with proper navigation
- All compilation errors resolved
- Hot reload working properly

---

## 💾 Data Persistence

The application uses Zustand with localStorage to persist:
- 🛒 Shopping cart items
- 👤 User session (when logged in)
- 🔍 Search queries
- 🏷️ Selected categories

---

## 📝 Notes

1. **Demo Mode:** This is a demonstration store. No real transactions occur.
2. **Data Reset:** Cart and user session reset on browser refresh (stored in localStorage).
3. **Sample Data:** All products, orders, and customers are pre-populated sample data.
4. **Admin Access:** Admin panel is in read-only demo mode for safety.

---

## 🎓 Learning the Codebase

### Project Structure
```
/src
  /app
    - Global layout and pages
    /admin - Admin panel pages
    /products - Product pages
    /checkout - Checkout process
  /components
    /layout - Header and Footer
    /products - Product-related components
    /home - Homepage sections
  /store
    - useStore.ts (Zustand store)
  /app/globals.css - Global styles with Islamic theme
```

### Key Files to Explore
1. `src/store/useStore.ts` - State management
2. `src/components/layout/Header.tsx` - Navigation
3. `src/app/page.tsx` - Homepage
4. `src/app/globals.css` - Islamic theme and animations

---

## 🚀 Deployment

To deploy to production:

```bash
npm run build
npm start
```

For Vercel:
```bash
vercel deploy
```

---

## 📞 Support

For any issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion/
- Zustand: https://github.com/pmndrs/zustand

---

## 🎉 Enjoy!

Tansiq Hub is ready to use. Start exploring and customizing it for your needs!

**بسم الله الرحمن الرحيم** 
*In the name of Allah, the Most Merciful*

---

*Last Updated: January 13, 2026*
