import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  WishlistService
} from '../../core/services/wishlist';

import {
  Product,
  ProductService
} from '../../core/services/product';


@Component({
  selector: 'app-product-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './product-details.html',

  styleUrl: './product-details.scss'
})


export class ProductDetails implements OnInit {


  // =========================================
  // PRODUCT
  // =========================================

  product?: Product;


  // =========================================
  // QUANTITY
  // =========================================

  quantity = 1;


  // =========================================
  // SELECTED COLOR
  // =========================================

  selectedColor = '';


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(

    private route: ActivatedRoute,

    private productService: ProductService,

    private wishlistService: WishlistService

  ) {}


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    // Get product

    this.product =
      this.productService.getProductById(id);


    // Select first color

    if (
      this.product?.colors?.length
    ) {

      this.selectedColor =
        this.product.colors[0];

    }

  }


  // =========================================
  // INCREASE QUANTITY
  // =========================================

  increaseQuantity(): void {

    this.quantity++;

  }


  // =========================================
  // DECREASE QUANTITY
  // =========================================

  decreaseQuantity(): void {

    if (this.quantity > 1) {

      this.quantity--;

    }

  }


  // =========================================
  // ADD TO CART
  // =========================================

  addToCart(): void {

    if (!this.product) {

      return;

    }


    console.log(
      'Add to cart:',
      this.product
    );


    console.log(
      'Quantity:',
      this.quantity
    );


    console.log(
      'Selected Color:',
      this.selectedColor
    );


    alert(
      `${this.product.name} added to cart`
    );

  }


  // =========================================
  // ADD / REMOVE WISHLIST
  // =========================================

  toggleWishlist(): void {

    if (!this.product) {

      return;

    }


    this.wishlistService
      .toggleWishlist(this.product);


    if (
      this.isInWishlist()
    ) {

      alert(
        `${this.product.name} added to wishlist`
      );

    } else {

      alert(
        `${this.product.name} removed from wishlist`
      );

    }

  }


  // =========================================
  // CHECK WISHLIST
  // =========================================

  isInWishlist(): boolean {

    if (!this.product) {

      return false;

    }


    return this.wishlistService
      .isInWishlist(
        this.product.id
      );

  }


  // =========================================
  // SELECT COLOR
  // =========================================

  selectColor(
    color: string
  ): void {

    this.selectedColor = color;

  }

}