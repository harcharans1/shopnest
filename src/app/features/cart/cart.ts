import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  CartService,
  CartProduct
} from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {

  cart: CartProduct[] = [];


  constructor(
    private cartService: CartService
  ) {

    this.cartService.cart$
      .subscribe(items => {

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

    this.cartService.clearCart();

  }


  get subtotal(): number {

    return this.cartService.getTotalPrice();

  }


  get totalItems(): number {

    return this.cartService.getTotalItems();

  }

}