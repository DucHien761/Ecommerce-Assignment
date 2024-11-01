import React from 'react';
import ProductList from './Product/ProductList/ProductList';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckoutPage from './Checkout/Checkout';
const App: React.FC = () => {
    return (
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Router>
      </CartProvider>
    );
  };

export default App;