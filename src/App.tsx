/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ComparisonProvider } from './context/ComparisonContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import ArtisanStories from './pages/ArtisanStories';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import ComparisonOverlay from './components/ComparisonOverlay';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ComparisonProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar id="main-nav" />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home id="home-page" />} />
                  <Route path="/shop" element={<Shop id="shop-page" />} />
                  <Route path="/product/:id" element={<ProductDetails id="product-details" />} />
                  <Route path="/stories" element={<ArtisanStories id="stories-page" />} />
                  <Route path="/profile" element={<Profile id="profile-page" />} />
                  <Route path="/cart" element={<Cart id="cart-page" />} />
                  <Route path="/wishlist" element={<Wishlist id="wishlist-page" />} />
                  <Route path="/checkout" element={<Checkout id="checkout-page" />} />
                  <Route path="/admin/*" element={<Admin id="admin-panel" />} />
                </Routes>
              </main>
              <ComparisonOverlay />
              <Footer id="main-footer" />
            </div>
          </Router>
        </ComparisonProvider>
      </CartProvider>
    </AuthProvider>
  );
}

