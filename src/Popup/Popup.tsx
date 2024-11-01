import React from 'react';
import './style.css';
interface CartPopupProps {
    product: {
        title: string;
        image: string;
    };
    onClose: () => void; // Function to close the popup
}

const CartPopup: React.FC<CartPopupProps> = ({ product, onClose }) => {
    return (
        <div className="cart-popup">
            <img src={product.image} alt={product.title} />
            <h2>{product.title} added to cart!</h2>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default CartPopup;