import React, { useState } from 'react';
import './style.css';
import { useCart } from '../../../context/CartContext';
import CartPopup from '../../../components/Popup/Popup'; // Import the CartPopup component
interface ProductItemProps {
    product: {
        id: number;
        title: string;
        price: number;
        image: string;
        category: string;
        rating?: { rate: number; count: number };
    };
}



const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const { addToCart } = useCart();
    const [popupVisible, setPopupVisible] = useState(false);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: 1 });
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000); // Hide popup after 3 seconds
    };

    return (
        <div className="product-item">
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>${product.price}</p>
            <p>Category: {product.category} </p>
            {product.rating && <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>}
            <button onClick={handleAddToCart}>Add to Cart</button>
            {popupVisible && (
                <CartPopup product={product} onClose={() => setPopupVisible(false)} />
            )}
        </div>
    );
};

export default ProductItem;