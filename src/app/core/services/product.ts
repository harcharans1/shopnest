import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
  badge?: string;
  colors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [

    {
      id: 1,
      name: 'Apple iPhone 16',
      category: 'Mobiles',
      brand: 'Apple',
      price: 69999,
      oldPrice: 79999,
      discount: 13,
      rating: 4.8,
      reviews: 1245,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
      description: 'Latest Apple iPhone with powerful performance, premium design and advanced camera system.',
      inStock: true,
      badge: 'Best Seller',
      colors: ['Black', 'White', 'Blue']
    },

    {
      id: 2,
      name: 'Samsung Galaxy S25',
      category: 'Mobiles',
      brand: 'Samsung',
      price: 74999,
      oldPrice: 84999,
      discount: 12,
      rating: 4.7,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      description: 'Premium Samsung smartphone with flagship performance and stunning AMOLED display.',
      inStock: true,
      badge: 'Trending',
      colors: ['Black', 'Silver']
    },

    {
      id: 3,
      name: 'MacBook Air M3',
      category: 'Laptops',
      brand: 'Apple',
      price: 99999,
      oldPrice: 114999,
      discount: 13,
      rating: 4.9,
      reviews: 645,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      description: 'Powerful and lightweight MacBook Air powered by Apple M3 chip.',
      inStock: true,
      badge: 'Premium',
      colors: ['Silver', 'Midnight']
    },

    {
      id: 4,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      brand: 'Sony',
      price: 24999,
      oldPrice: 29999,
      discount: 17,
      rating: 4.8,
      reviews: 2341,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      description: 'Premium wireless headphones with industry-leading noise cancellation.',
      inStock: true,
      badge: 'Top Rated',
      colors: ['Black', 'Silver']
    },

    {
      id: 5,
      name: 'Nike Air Max',
      category: 'Fashion',
      brand: 'Nike',
      price: 6999,
      oldPrice: 9999,
      discount: 30,
      rating: 4.6,
      reviews: 756,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      description: 'Comfortable and stylish Nike sneakers designed for everyday performance.',
      inStock: true,
      badge: '30% OFF',
      colors: ['Red', 'Black', 'White']
    },

    {
      id: 6,
      name: 'Premium Smart Watch',
      category: 'Wearables',
      brand: 'Samsung',
      price: 12999,
      oldPrice: 16999,
      discount: 24,
      rating: 4.5,
      reviews: 431,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      description: 'Smart fitness watch with health tracking, notifications and premium design.',
      inStock: true,
      badge: 'New',
      colors: ['Black', 'Silver']
    },

    {
      id: 7,
      name: 'Modern Backpack',
      category: 'Fashion',
      brand: 'Urban',
      price: 1999,
      oldPrice: 2999,
      discount: 33,
      rating: 4.4,
      reviews: 321,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      description: 'Modern water-resistant backpack suitable for college, office and travel.',
      inStock: true,
      badge: 'Popular',
      colors: ['Black', 'Grey']
    },

    {
      id: 8,
      name: 'Air Fryer 5L',
      category: 'Home',
      brand: 'Philips',
      price: 7999,
      oldPrice: 9999,
      discount: 20,
      rating: 4.6,
      reviews: 512,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      description: 'Large capacity air fryer for healthier and faster everyday cooking.',
      inStock: true,
      badge: 'Deal',
      colors: ['Black']
    }

  ];


  getProducts(): Product[] {
    return this.products;
  }


  getProductById(id: number): Product | undefined {
    return this.products.find(
      product => product.id === id
    );
  }


  getProductsByCategory(
    category: string
  ): Product[] {

    return this.products.filter(
      product =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );

  }


  searchProducts(
    search: string
  ): Product[] {

    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return this.products;
    }

    return this.products.filter(product =>
      product.name.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value) ||
      product.brand.toLowerCase().includes(value)
    );

  }

}