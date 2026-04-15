import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}