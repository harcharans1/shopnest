import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Product,
  ProductService
} from '../../core/services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  products: Product[] = [];

  filteredProducts: Product[] = [];

  searchTerm = '';

  selectedCategory = 'All';

  sortOption = 'default';

  categories = [
    'All',
    'Mobiles',
    'Laptops',
    'Audio',
    'Fashion',
    'Wearables',
    'Home'
  ];


  constructor(
    private productService: ProductService
  ) {}


  ngOnInit(): void {

    this.products =
      this.productService.getProducts();

    this.filteredProducts =
      [...this.products];

  }


  filterCategory(
    category: string
  ): void {

    this.selectedCategory = category;

    this.applyFilters();

  }


  searchProducts(): void {

    this.applyFilters();

  }


  sortProducts(): void {

    this.applyFilters();

  }


  applyFilters(): void {

    let result =
      [...this.products];


    // SEARCH

    if (this.searchTerm.trim()) {

      const search =
        this.searchTerm
          .toLowerCase()
          .trim();

      result =
        result.filter(product =>
          product.name
            .toLowerCase()
            .includes(search) ||

          product.brand
            .toLowerCase()
            .includes(search) ||

          product.category
            .toLowerCase()
            .includes(search)
        );

    }


    // CATEGORY

    if (
      this.selectedCategory !== 'All'
    ) {

      result =
        result.filter(product =>
          product.category ===
          this.selectedCategory
        );

    }


    // SORT

    if (this.sortOption === 'low') {

      result.sort(
        (a, b) =>
          a.price - b.price
      );

    }

    if (this.sortOption === 'high') {

      result.sort(
        (a, b) =>
          b.price - a.price
      );

    }

    if (this.sortOption === 'rating') {

      result.sort(
        (a, b) =>
          b.rating - a.rating
      );

    }


    this.filteredProducts =
      result;

  }


  trackProduct(
    index: number,
    product: Product
  ): number {

    return product.id;

  }

}