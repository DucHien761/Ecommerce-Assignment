import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import { CartContext } from '../../context/CartContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../services/api', () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    { id: 1, title: 'Product 1', price: 50, category: 'electronics', image: '', rating: { rate: 4, count: 120 } },
    { id: 2, title: 'Product 2', price: 100, category: 'jewelery', image: '', rating: { rate: 4.5, count: 200 } },
  ]),
}));

describe('ProductList Component', () => {
  const mockAddToCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockGetTotalPrice = jest.fn().mockReturnValue(0);

  const mockCartItems = []; 

  const mockCartContextValue = {
    cartItems: mockCartItems,
    addToCart: mockAddToCart,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    getTotalPrice: mockGetTotalPrice,
  };

  beforeEach(() => {
    render(
      <CartContext.Provider value={mockCartContextValue}>
        <Router>
          <ProductList />
        </Router>
      </CartContext.Provider>
    );
  });

  test('renders ProductList component', async () => {
    expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  test('filters products by category', async () => {
    // Find and open the category select dropdown
    fireEvent.click(screen.getByText(/All Categories/i));

    // Select "electronics" category
    fireEvent.click(screen.getByText(/Electronics/i));

    // Check that only electronics products are displayed
    expect(await screen.findAllByText(/Product 1/i)).toHaveLength(1);
    expect(screen.queryByText(/Product 2/i)).not.toBeInTheDocument();
  });

  test('sorts products by price: low to high', async () => {
    // Open the sort dropdown
    fireEvent.click(screen.getByText(/Sort by/i));

    // Select "Price: Low to High"
    fireEvent.click(screen.getByText(/Price: Low to High/i));

    // Ensure products are sorted in the correct order
    const productTitles = await screen.findAllByText(/Product/i);
    expect(productTitles[0]).toHaveTextContent('Product 1');
    expect(productTitles[1]).toHaveTextContent('Product 2');
  });

  test('adds a product to the cart', async () => {
    // Click the "Add to Cart" button for Product 1
    const addToCartButtons = await screen.findAllByText(/Add to Cart/i);
    fireEvent.click(addToCartButtons[0]);

    // Check if the addToCart function was called with the correct product
    expect(mockAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 1, title: 'Product 1' }));
  });

  test('handles empty cart on checkout', async () => {
    // Check for empty cart message
    fireEvent.click(screen.getByRole('button', { name: /Shopping Cart/i }));
    expect(await screen.findByText(/Your cart is empty/i)).toBeInTheDocument();
  });
});
