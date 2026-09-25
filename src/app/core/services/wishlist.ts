import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlist: Product[] = [];


  // =========================================
  // GET WISHLIST
  // =========================================

  getWishlist(): Product[] {
    return [...this.wishlist];
  }


  // =========================================
  // ADD PRODUCT
  // =========================================

  addToWishlist(product: Product): void {

    const exists =
      this.wishlist.some(
        item => item.id === product.id
      );

    if (!exists) {
      this.wishlist.push(product);
    }

  }


  // =========================================
  // REMOVE PRODUCT
  // =========================================

  removeFromWishlist(
    productId: number
  ): void {

    this.wishlist =
      this.wishlist.filter(
        item => item.id !== productId
      );

  }


  // =========================================
  // TOGGLE WISHLIST
  // =========================================

  toggleWishlist(
    product: Product
  ): void {

    if (this.isInWishlist(product.id)) {

      this.removeFromWishlist(
        product.id
      );

    } else {

      this.addToWishlist(product);

    }

  }


  // =========================================
  // CHECK PRODUCT
  // =========================================

  isInWishlist(
    productId: number
  ): boolean {

    return this.wishlist.some(
      item => item.id === productId
    );

  }


  // =========================================
  // COUNT
  // =========================================

  getWishlistCount(): number {

    return this.wishlist.length;

  }


  // =========================================
  // CLEAR
  // =========================================

  clearWishlist(): void {

    this.wishlist = [];

  }

}