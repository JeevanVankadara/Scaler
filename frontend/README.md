# Flipkart Clone — Frontend Workflow

> All pages are currently **static** (hardcoded data). This document maps the frontend structure for backend integration.

---

## Tech Stack

React 19 · React Router DOM v7 · Vite 8 · Tailwind CSS v4 · Lucide React (icons)

---

## Routes

| Route              | Page Component      | Description                       |
|--------------------|---------------------|-----------------------------------|
| `/`                | `<Home />`          | Landing page with banners & deals |
| `/search?q=...`    | `<SearchResults />` | Product listing with filters      |
| `/product-details` | `<ProductDetails />`| Single product detail view        |
| `/cart`            | `<Cart />`          | Shopping cart & price summary     |
| `/orders`          | `<Orders />`        | Past order history                |

> `/profile`, `/login`, `/logout` are linked in NavBar dropdown but **have no routes yet**.

---

## Navigation Flow

```
                         NAVBAR (present on every page)
              ┌──────────┬──────────┬────────────┬────────┐
              │ Logo (/) │ Search   │ Profile ▼  │ Cart   │
              └────┬─────┴────┬─────┤ My Orders  │ (/cart)│
                   │          │     │ Logout     │        │
                   ▼          ▼     └────────────┘────────┘
              HOME (/)   SEARCH (/search?q=)
                │              │
                │ click card   │ click product
                ▼              ▼
            PRODUCT DETAILS (/product-details)
                │
                │ Add to Cart / Buy Now (needs backend)
                ▼
            CART (/cart) ──► Place Order (needs backend)
```

| From              | Action                        | Goes To                    |
|-------------------|-------------------------------|----------------------------|
| Any page          | Click Flipkart logo           | `/`                        |
| Any page          | Search + Enter                | `/search?q={query}`        |
| Any page          | Click Cart icon               | `/cart`                    |
| Any page          | Profile → My Orders           | `/orders`                  |
| Home              | Click gadget/product card     | `/product-details`         |
| Search Results    | Click ProductCard             | `/product-details`         |
| Product Details   | Click similar product         | `/product-details`         |
| Product Details   | Add to Cart / Buy Now         | *(no logic yet)*           |
| Cart              | Place Order                   | *(no logic yet)*           |

---

## Pages & Components

### 1. Home (`/`)
- **NavBar** → **CategoryNav** (12 category tabs) → **CategoryContent** (banner carousel + **BestGadgets** ×5) → **Footer**
- Only `"for-you"` category renders content; others show a placeholder
- Gadget cards navigate to `/product-details` on click

### 2. Search Results (`/search`)
- **NavBar** → Sidebar: **ProductFilters** (sort, brand, price) + **ProductCard** list (4 static items) → **Footer**
- Reads `?q=` param via `useSearchParams()`
- Each ProductCard navigates to `/product-details`

### 3. Product Details (`/product-details`)
- **NavBar** → **ProductGallery** (left, sticky) + Right panel (color, variant, price, delivery, highlights, description) + **StickyBuyBar** (Cart / EMI / Buy Now) → **SimilarProducts** → **Footer**
- State: `selectedColor`, `selectedVariant`
- Buy/Cart buttons have **no logic yet**

### 4. Cart (`/cart`)
- **NavBar** (cartCount=2) → Left: cart items (qty ±, save/remove/buy actions) + Right: **TotalCost** (price breakdown, Place Order) → **Footer**
- 2 static items; all actions are **non-functional**

### 5. Orders (`/orders`)
- **NavBar** → Breadcrumb → Sidebar: **OrderFilters** (status, time) + **OrderItem** list (4 static orders) → **Footer**
- Search bar and filters are **non-functional**

---

## Data Structures (Backend Reference)

### Product
```json
{
  "id": "string",
  "title": "string",
  "image": "string",
  "rating": 4.6,
  "reviews": "156 Ratings",
  "highlights": ["..."],
  "price": 44999,
  "originalPrice": 59999,
  "discountLabel": "25% off",
  "exchangeValue": 32700
}
```

### Cart Item
```json
{
  "id": 1,
  "name": "string",
  "spec": "450 ml",
  "seller": "string",
  "price": 300,
  "mrp": 499,
  "off": "39%",
  "img": "string",
  "delivery": "Apr 22, Wed",
  "quantity": 1
}
```

### Order
```json
{
  "id": 1,
  "title": "string",
  "price": "₹1,602",
  "color": "Green",
  "delivered": "Jan 07, 2025",
  "image": "string",
  "status": "delivered"
}
```

---

## Backend Integration Checklist

### API Endpoints Needed

| Endpoint                       | Method | Purpose                              |
|--------------------------------|--------|--------------------------------------|
| `/api/auth/login`              | POST   | User login                           |
| `/api/auth/register`           | POST   | User registration                    |
| `/api/auth/logout`             | POST   | User logout                          |
| `/api/auth/profile`            | GET    | Get user profile                     |
| `/api/products`                | GET    | Search/list products (with filters)  |
| `/api/products/:id`            | GET    | Single product details               |
| `/api/products/similar/:id`    | GET    | Similar products                     |
| `/api/categories`              | GET    | Category list                        |
| `/api/banners`                 | GET    | Home page banners                    |
| `/api/cart`                    | GET    | Get cart items                       |
| `/api/cart/add`                | POST   | Add to cart                          |
| `/api/cart/update`             | PUT    | Update quantity                      |
| `/api/cart/remove`             | DELETE | Remove from cart                     |
| `/api/orders`                  | GET    | Order history                        |
| `/api/orders`                  | POST   | Place order                          |

### Frontend Changes Needed

- Change `/product-details` → `/product/:id` (pass product ID in URL)
- Add routes: `/login`, `/register`, `/profile`
- Replace `<a href>` with `<Link to>` in NavBar (avoid full page reloads)
- Add auth context (user state, token)
- Add cart context (cart count for NavBar badge)
