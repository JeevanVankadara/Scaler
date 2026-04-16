# 🛒 Flipkart Clone — E-Commerce Platform

**SDE Intern Fullstack Assignment**

A fully responsive, full-stack Single Page Application (SPA) that closely replicates Flipkart's design and user experience. Built with React + Vite on the frontend and Node.js + Express + PostgreSQL on the backend.

## 🌐 Live Demo

> **👉 [https://flipkart-clone-jeevan.onrender.com/](https://flipkart-clone-jeevan.onrender.com/)**

---

## Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Product Listing Page | ✅ | Grid layout with search, category filtering, brand/price/rating filters |
| Product Detail Page | ✅ | Image carousel, highlights, specifications, stock tracking |
| Shopping Cart | ✅ | Add/Remove, quantity limits (max 6), Save for Later, total summary |
| Order Placement | ✅ | Checkout flow with address, generates unique Order ID |
| Order History | ✅ Bonus | Persistent order tracking via localStorage |
| Wishlist | ✅ Bonus | Heart products, toast notifications, persistent list |
| Email Notifications | ✅ Bonus | Order confirmation emails via Resend API |
| Responsive Design | ✅ Bonus | Desktop, Tablet, and Mobile layouts via Tailwind CSS |
| Out-of-Stock Handling | ✅ | Disabled Buy button, visual badge, Cart/Wishlist still allowed |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js (Vite) | SPA with fast HMR |
| Styling | Tailwind CSS | Utility-first responsive design |
| Routing | React Router DOM | Client-side page navigation |
| State | Context API + localStorage | Cart, wishlist, profile, orders persistence |
| Backend | Node.js + Express.js | RESTful API server |
| Database | PostgreSQL (Supabase) | Product catalog, categories, banners |
| Email | Resend API | Order confirmation emails |

---

## Database & Resend API Setup

### Step 1: Create a Supabase PostgreSQL Database

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in.
2. Click **"New Project"** → give it a name (e.g., `flipkart-clone`) and set a database password.
3. Wait for the project to finish provisioning (~30 seconds).
4. Navigate to **Project Settings → Database → Connection String → URI**.
5. Copy the connection string. It will look like:
   ```
   postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you set in step 2 (URL-encode special characters, e.g., `@` → `%40`).

### Step 2: Get a Resend API Key (for order emails)

1. Go to [https://resend.com](https://resend.com) and create a free account.
2. Navigate to **API Keys** → click **"Create API Key"**.
3. Copy the key (starts with `re_...`).
4. *(Optional)* Under **Domains**, you can add your own domain or use the default sandbox for testing.

### Step 3: Configure Environment Variables

Create a `.env` file inside the `Backend/` folder:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
RESEND_API_URL=re_YOUR_RESEND_API_KEY
DEFAULT_EMAIL=your-email@example.com
FROM_ADDRESS=Flipkart Clone <orders@yourdomain.com>
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Seed the Database

```bash
cd Backend
npm install

# Step 1 — Seeds schema + data.json (28 products, 5 home sections, 4 banners, 12 categories)
node db/seed.js

# Step 2 — Appends data2.json (24 more products, 2 more home sections, IDs offset by 28)
node db/seed-append.js
```

> **Note:** `seed.js` drops and recreates all tables, so always run it before `seed-append.js`.

---

## 🛠️ Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or later
- A PostgreSQL database (see Supabase setup above)

### 1. Start the Backend
```bash
cd Backend
npm install
npm run dev
```
> Backend starts on `http://localhost:5000`

### 2. Start the Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
> Frontend starts on `http://localhost:5173`

---

## 📁 Project Folder Structure

```
Scaler/
├── README.md                          # Project documentation (this file)
├── .gitignore                         # Git ignore rules
│
├── Backend/                           # Express.js API server
│   ├── server.js                      # Entry point — mounts routes, starts Express
│   ├── package.json                   # Backend dependencies & scripts
│   ├── .env                           # Environment variables (DB, Resend, etc.)
│   │
│   ├── data/
│   │   ├── data.json                  # Primary seed data (28 products, categories, banners, home sections)
│   │   └── data2.json                 # Supplementary seed data (24 more products, additional sections)
│   │
│   ├── db/
│   │   ├── index.js                   # PostgreSQL connection pool (uses DATABASE_URL)
│   │   ├── schema.sql                 # Full DDL — tables, indexes, triggers
│   │   ├── seed.js                    # Drops & recreates DB, seeds data.json
│   │   └── seed-append.js             # Appends data2.json with ID offset (no data loss)
│   │
│   ├── routes/
│   │   ├── products.js                # GET /api/products — search, filter, category, home data
│   │   ├── categories.js              # GET /api/categories — navbar category list
│   │   ├── orders.js                  # POST /api/orders — stock decrement + email dispatch
│   │   └── cart.js                    # POST /api/cart/validate — stock validation at checkout
│   │
│   └── utils/
│       ├── store-db.js                # Core DB queries — product fetch, order creation, stock lock
│       ├── store.js                   # Legacy in-memory store (kept as fallback reference)
│       └── mailer.js                  # Resend email integration — HTML order confirmation builder
│
└── frontend/                          # React + Vite SPA
    ├── index.html                     # HTML entry point
    ├── vite.config.js                 # Vite build configuration
    ├── package.json                   # Frontend dependencies & scripts
    ├── .env                           # VITE_API_URL (points to backend)
    │
    ├── public/                        # Static assets (posters, icons, product photos)
    │
    └── src/
        ├── main.jsx                   # React DOM mount point
        ├── App.jsx                    # Root component — React Router setup
        ├── index.css                  # Global Tailwind CSS imports
        │
        ├── context/
        │   └── CartContext.jsx         # Global state provider (cart, wishlist, profile, saved, orders)
        │
        ├── utils/
        │   └── apiCache.js            # In-memory API response cache to reduce redundant fetches
        │
        └── pages/
            ├── Home.jsx               # Landing page — banner carousel + category sections
            ├── SearchResults.jsx      # Search & filter results with sidebar filters
            ├── ProductDetails.jsx     # Full product detail + image gallery + buy/cart actions
            ├── Cart.jsx               # Cart page with Save for Later, quantity control, totals
            ├── Checkout.jsx           # Address form + order summary + Place Order action
            ├── OrderConfirmation.jsx  # Post-purchase confirmation with Order ID
            ├── Orders.jsx             # Order history list with status filters
            ├── Profile.jsx            # User profile & delivery address editor
            ├── Wishlist.jsx           # Wishlisted products grid
            │
            └── components/
                ├── NavBar.jsx              # Top navigation — search, cart count, profile dropdown
                ├── CategoryNav.jsx         # Horizontal category tab bar (For You, Fashion, etc.)
                ├── CategoryContent.jsx     # Dynamic content renderer per category tab
                ├── BestGadgets.jsx         # Reusable product section card grid
                ├── ProductCard.jsx         # Individual product card in search results
                ├── ProductFilters.jsx      # Sidebar filters (brand, price, rating, sort)
                ├── ProductGallery.jsx      # Thumbnail + main image viewer
                ├── StickyBuyBar.jsx        # Sticky Add to Cart / Buy Now bar
                ├── SimilarProducts.jsx     # "Similar Products" horizontal scroll section
                ├── TotalCost.jsx           # Cart price breakdown component
                ├── CheckoutStepper.jsx     # Step indicator for checkout flow
                ├── OrderSummaryItem.jsx    # Line item in checkout summary
                ├── OrderItem.jsx           # Order card in history page
                ├── OrderFilters.jsx        # Time-range filter for order history
                ├── AccountSidebar.jsx      # Account page side navigation
                ├── Footer.jsx             # Site footer with links & info
                ├── OutOfStockPopup.jsx     # Modal popup when stock is insufficient
                └── WishlistToast.jsx       # Temporary "Added to wishlist" toast notification
```

---

## Application Workflows

### 1. Order Processing Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  User adds   │────▶│  Checkout page   │────▶│  POST /api/orders    │
│  items to    │     │  shows cart from  │     │  Backend receives    │
│  cart (local │     │  localStorage     │     │  item IDs + email    │
│  Storage)    │     │  + address form   │     │  + address           │
└─────────────┘     └─────────────────┘     └──────────┬───────────┘
                                                       │
                                           ┌───────────▼───────────┐
                                           │  SELECT FOR UPDATE    │
                                           │  (row-level lock)     │
                                           │  Validates stock > 0  │
                                           │  Decrements stock     │
                                           └───────────┬───────────┘
                                                       │
                                  ┌────────────────────┼────────────────────┐
                                  ▼                                        ▼
                     ┌──────────────────────┐              ┌──────────────────────┐
                     │  Returns Order JSON  │              │  Fire-and-forget     │
                     │  to frontend         │              │  email dispatch      │
                     │  (saved to orders    │              │  via Resend API      │
                     │   in localStorage)   │              └──────────────────────┘
                     └──────────────────────┘
```

### 2. Email Dispatch Flow

1. **Trigger:** Immediately after `POST /api/orders` completes the stock decrement.
2. **Recipient:** Uses the `email` from the user's Profile state. Falls back to `DEFAULT_EMAIL` if blank.
3. **Content:** Sends an HTML email with order items, quantities, prices, and total amount.
4. **Pattern:** Fire-and-forget — email failures are logged but never block the order response.

---

## Assumptions Made

### 1. No Login/Signup Implementation
I **did not implement a Login/Signup OAuth flow**. As per the assignment brief, I focused complexity on robust UI/UX, cart management with "Save For Later" branching, and backend concurrency — rather than authentication.

### 2. Default Profile Strategy
Since there is no sign-in, the application pre-loads a **default profile**:
- Name: `Jeevan`
- Phone: `9618006235`
- Address: `A-5, Road-1, Sagar Cements, Kodad`

If the user never edits their profile, these defaults are used for checkout and email delivery.

### 3. Profile Edits Persist in localStorage
When a user modifies any field on the **Profile page** (name, email, phone, address, city, state), the changes are saved immediately to `localStorage`. All components (NavBar location display, Checkout form, etc.) read from this updated data.

### 4. Logout Wipes All Session Data
Clicking **Logout** completely clears `localStorage` — deleting cart, saved items, wishlist, orders, and profile data. This simulates session destruction without a real auth backend.

### 5. Cart is Client-Side Only
The shopping cart, wishlist, and "Save for Later" lists live entirely in `localStorage`. The database does **not** store cart state. This decision simplifies the no-login architecture and avoids user-session coupling in the backend.

### 6. Backend Concurrency
The backend uses PostgreSQL `SELECT ... FOR UPDATE` row-level locking to prevent overselling when multiple users checkout simultaneously.

---

## Database Schema (4 Tables)

The cart is fully abstracted into localStorage. The PostgreSQL database manages only the **product catalog and homepage layout** using exactly **4 active tables**:

```mermaid
erDiagram
    CATEGORIES {
        VARCHAR id PK "e.g. 'fashion', 'mobiles'"
        VARCHAR label "Display name"
        TEXT icon "SVG icon path"
        TIMESTAMP created_at
    }

    PRODUCTS {
        VARCHAR id PK "Product ID"
        VARCHAR title "Product name"
        VARCHAR brand "Brand name"
        VARCHAR category "Category label (denormalized for search)"
        VARCHAR category_id FK "Links to categories.id"
        NUMERIC price "Selling price"
        NUMERIC original_price "MRP before discount"
        VARCHAR discount_label "e.g. '30% off'"
        NUMERIC rating "0.0 to 5.0"
        INTEGER review_count "Number of ratings"
        BOOLEAN f_assured "Flipkart Assured badge"
        INTEGER stock "Available inventory (decremented on order)"
        TEXT_ARRAY images "Product image URLs"
        TEXT_ARRAY highlights "Key features list"
        TEXT_ARRAY description "Detailed description"
        TIMESTAMP updated_at "Auto-updated via trigger"
    }

    BANNERS {
        SERIAL id PK
        TEXT image "Banner image path"
        TEXT link "Click-through URL"
    }

    HOME_SECTIONS {
        SERIAL id PK
        VARCHAR title "Section heading"
        VARCHAR type "Section type (product)"
        VARCHAR bg_color "Background colour hex"
        VARCHAR category_id "Category for 'View All' link"
        TEXT_ARRAY product_ids "Product IDs to display"
    }

    CATEGORIES ||--o{ PRODUCTS : "contains"
    HOME_SECTIONS }o--|| CATEGORIES : "links to"
```

