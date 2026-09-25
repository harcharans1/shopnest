import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  products: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories {

  categories: Category[] = [

    {
      name: 'Mobiles',
      slug: 'mobiles',
      icon: '📱',
      description: 'Smartphones, cases and mobile accessories',
      products: '1,200+ Products'
    },

    {
      name: 'Electronics',
      slug: 'electronics',
      icon: '💻',
      description: 'Laptops, gadgets and smart electronics',
      products: '2,500+ Products'
    },

    {
      name: 'Fashion',
      slug: 'fashion',
      icon: '👕',
      description: 'Clothing, footwear and latest trends',
      products: '5,000+ Products'
    },

    {
      name: 'Beauty',
      slug: 'beauty',
      icon: '💄',
      description: 'Makeup, skincare and personal care',
      products: '1,800+ Products'
    },

    {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      icon: '🏠',
      description: 'Furniture, appliances and kitchen essentials',
      products: '3,200+ Products'
    },

    {
      name: 'Audio',
      slug: 'audio',
      icon: '🎧',
      description: 'Headphones, earbuds and speakers',
      products: '950+ Products'
    },

    {
      name: 'Gaming',
      slug: 'gaming',
      icon: '🎮',
      description: 'Gaming consoles, accessories and games',
      products: '700+ Products'
    },

    {
      name: 'Grocery',
      slug: 'grocery',
      icon: '🛒',
      description: 'Daily essentials and groceries',
      products: '4,000+ Products'
    },

    {
      name: 'Sports',
      slug: 'sports',
      icon: '⚽',
      description: 'Sports equipment and fitness products',
      products: '1,100+ Products'
    },

    {
      name: 'Books',
      slug: 'books',
      icon: '📚',
      description: 'Books, education and learning',
      products: '2,000+ Products'
    },

    {
      name: 'Toys',
      slug: 'toys',
      icon: '🧸',
      description: 'Toys and products for kids',
      products: '1,500+ Products'
    },

    {
      name: 'Automotive',
      slug: 'automotive',
      icon: '🚗',
      description: 'Car and bike accessories',
      products: '850+ Products'
    }

  ];

}