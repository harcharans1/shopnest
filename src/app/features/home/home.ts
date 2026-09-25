import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Category {
  name: string;
  icon: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  categories: Category[] = [
    {
      name: 'Mobiles',
      icon: '📱',
      description: 'Smartphones & accessories'
    },
    {
      name: 'Electronics',
      icon: '💻',
      description: 'Laptops & gadgets'
    },
    {
      name: 'Fashion',
      icon: '👕',
      description: 'Latest styles & trends'
    },
    {
      name: 'Beauty',
      icon: '💄',
      description: 'Beauty & personal care'
    },
    {
      name: 'Home',
      icon: '🏠',
      description: 'Home & kitchen'
    },
    {
      name: 'Audio',
      icon: '🎧',
      description: 'Headphones & speakers'
    }
  ];

  features: Feature[] = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick delivery across India'
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Safe & secure checkout'
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: 'Simple return process'
    },
    {
      icon: '⭐',
      title: 'Trusted Shopping',
      description: 'Quality products & service'
    }
  ];

}