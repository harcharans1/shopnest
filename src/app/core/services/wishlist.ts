import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'shopnest-wishlist';
  private wishlist: Product[] = this.loadWishlist();

  getWishlist(): Product[] { return [...this.wishlist]; }

  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product.id)) {
      this.wishlist = [...this.wishlist, product];
      this.save();
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.save();
  }

  toggleWishlist(product: Product): void {
    this.isInWishlist(product.id)
      ? this.removeFromWishlist(product.id)
      : this.addToWishlist(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some(item => item.id === productId);
  }

  getWishlistCount(): number { return this.wishlist.length; }

  clearWishlist(): void {
    this.wishlist = [];
    this.save();
  }

  private save(): void {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist)); } catch {}
  }

  private loadWishlist(): Product[] {
    try {
      const value = localStorage.getItem(this.storageKey);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
}