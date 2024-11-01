// src/components/Filter.tsx
import React from 'react';

interface FilterProps {
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
}

const Filter: React.FC<FilterProps> = ({ setFilters, setSortOption }) => {
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev: { category?: string; minPrice?: number; maxPrice?: number; rating?: number }) => ({ 
            ...prev, 
            category: e.target.value 
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev: any) => ({ ...prev, [name]: Number(value) })); // Specify type for prev
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev: { category?: string; minPrice?: number; maxPrice?: number; rating?: number }) => 
            ({ ...prev, rating: Number(e.target.value) })
        );
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="filter-container">
            <select onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
            </select>
            <input type="number" name="minPrice" placeholder="Min Price" onChange={handlePriceChange} />
            <input type="number" name="maxPrice" placeholder="Max Price" onChange={handlePriceChange} />
            <select onChange={handleRatingChange}>
                <option value="0">All Ratings</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
            </select>
            <select onChange={handleSortChange}>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="ratingHighToLow">Rating: High to Low</option>
                <option value="nameAZ">Name: A-Z</option>
                <option value="nameZA">Name: Z-A</option>
            </select>
        </div>
    );
};

export default Filter;
