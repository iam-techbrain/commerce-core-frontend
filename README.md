# 🛍️ Chhabra Sports - E-Commerce Storefront & Admin Portal

> High-performance, modern full-stack e-commerce frontend built with **React 18**, **Vite 5**, and **TanStack Query v5**. Features a responsive customer shopping experience and a complete enterprise admin dashboard.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Dynamic Catalog & Filtering**: Browse products with server-side pagination, price sorting, brand, and category filtering.
- **Product Details & Variants**: Multi-attribute variant selectors (Colors, Sizes, Specs), high-res image galleries, discount badges, and customer reviews.
- **Cart & Slide-in Drawer**: Instant cart updates with stock validation limits, coupon code discount engine, and free-shipping indicators.
- **Seamless Checkout & Payments**: Razorpay payment gateway integration with dynamic fallback for test simulations and address management.
- **User Profile Portal**: Manage personal details, update password, track active and past orders, view invoices, and manage delivery addresses.
- **Performance Optimized**: Data fetching powered by **TanStack Query v5** with 5-minute stale-time caching, eliminating redundant API requests to the server.

### 🛡️ Admin Management Console (`/admin`)
- **RuangAdmin Modern Theme**: Sleek administrative interface with responsive sidebar and top navigation.
- **Live Theme Customizer**: Real-time palette color picker for Sidebar, Header, Body, and Footer with instant browser LocalStorage persistence.
- **Product Management**:
  - Full CRUD operations with instant inline price/stock/name editing.
  - Multi-variant management modal for color, size, SKU, and variant image assignment.
  - Excel / CSV Bulk Upload (up to 50 rows per batch) with downloadable template.
- **Category & Brand Management**: Parent categories, nested subcategories, and brand logos with file upload support.
- **Order Management**: Real-time status workflow (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`).
- **User & Role Administration**: Manage customer and admin roles, profile information, and access control.

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | UI Library & Components |
| **Vite** | `^5.2.0` | Next-gen Frontend Tooling & Fast HMR |
| **TanStack React Query** | `^5.104.0` | Asynchronous Server State & Smart Caching |
| **React Router** | `^7.18.4` | Client-Side SPA Routing |
| **Axios** | `^1.6.8` | HTTP Client for REST API Communication |
| **Lucide React** | `^0.359.0` | Modern, Lightweight SVG Iconography |

---

## 📁 Project Structure

```
commerce-core-frontend/
├── dist/                     # Optimized production bundle
├── public/                   # Static assets & avatars
├── src/
│   ├── api/                  # Axios instance and API config
│   ├── assets/               # Local styles and images
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin Layout, Sidebar, Navbar
│   │   ├── auth/             # AuthModal & Protected Route Guards
│   │   ├── cart/             # CartDrawer, CheckoutModal, CartItem
│   │   ├── common/           # Pagination, Modal, Toast
│   │   ├── layout/           # Customer Header, Footer, Hero
│   │   └── product/          # ProductCard, ProductGrid, Filters
│   ├── context/              # AuthContext & CartContext providers
│   ├── hooks/                # Custom React hooks (e.g. useProducts)
│   ├── pages/                # Storefront pages (Home, Products, Profile, Login)
│   │   └── admin/            # Admin pages (Dashboard, Products, Orders, Users, Settings)
│   ├── App.jsx               # Application routes & layout configuration
│   ├── index.css             # Design system tokens and global styling
│   └── main.jsx              # React DOM entry point & QueryClient provider
├── index.html                # HTML5 root template
├── package.json              # Dependencies & scripts
└── vite.config.js            # Vite configuration & manual code splitting
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20+` or `v24+`)
- **NPM**: `v9+` or `v10+`

### Installation
1. Navigate into the frontend folder:
   ```bash
   cd commerce-core-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be live at: `http://localhost:5173`

---

## 📦 Build & Production

To generate a minified, production-ready bundle with manual chunk splitting:

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Production Bundle Optimization
Configured in `vite.config.js`:
- `vendor` chunk (React, React-DOM, React Router, Axios)
- `query` chunk (@tanstack/react-query)
- `icons` chunk (lucide-react)

---

## 🔑 Default Admin Access

To access the Admin Portal (`http://localhost:5173/admin/login`):
- **Email**: `admin@ecommerce.com`
- **Password**: `Admin@1234`

---

## 📄 License
This project is proprietary software for Chhabra Sports SaaS Platform. All rights reserved.
