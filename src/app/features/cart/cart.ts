import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartProduct } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit, OnDestroy {
  cart: CartProduct[] = [];
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cart = items;
    });
  }

  increase(id: number): void {
    this.cartService.increaseQuantity(id);
  }

  decrease(id: number): void {
    this.cartService.decreaseQuantity(id);
  }

  remove(id: number): void {
    this.cartService.removeFromCart(id);
  }

  clearCart(): void {
    if (!this.cart.length) return;
    const confirmed = confirm('Are you sure you want to clear your cart?');
    if (confirmed) this.cartService.clearCart();
  }

  get subtotal(): number {
    return this.cartService.getTotalPrice();
  }

  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
