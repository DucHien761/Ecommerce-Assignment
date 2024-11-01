// types/index.d.ts
export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    image: string;
    rating: { rate: number; count: number };
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  