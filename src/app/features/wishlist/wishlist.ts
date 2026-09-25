import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Product
} from '../../core/services/product';

import {
  WishlistService
} from '../../core/services/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist implements OnInit {

  wishlist: Product[] = [];


  constructor(
    private wishlistService: WishlistService
  ) {}


  ngOnInit(): void {

    this.loadWishlist();

  }


  // =========================================
  // LOAD
  // =========================================

  loadWishlist(): void {

    this.wishlist =
      this.wishlistService
        .getWishlist();

  }


  // =========================================
  // REMOVE
  // =========================================

  removeProduct(
    productId: number
  ): void {

    this.wishlistService
      .removeFromWishlist(productId);

    this.loadWishlist();

  }


  // =========================================
  // CLEAR
  // =========================================

  clearWishlist(): void {

    this.wishlistService
      .clearWishlist();

    this.loadWishlist();

  }


  // =========================================
  // TRACK
  // =========================================

  trackProduct(
    index: number,
    product: Product
  ): number {

    return product.id;

  }

}