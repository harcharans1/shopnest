import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  CartProduct,
  CartService
} from '../../core/services/cart';

import { AuthService } from '../../core/services/auth';

import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {

  cart: CartProduct[] = [];

  processing = false;

  error = '';

  success = '';


  customer = {

    fullName: '',

    phone: '',

    address: '',

    city: '',

    state: '',

    pincode: ''

  };


  paymentMethod = 'cod';


  constructor(
    private cartService: CartService,

    private authService: AuthService,

    private orderService: OrderService,

    private router: Router
  ) {

    this.cart =
      this.cartService.getCart();

  }


  get subtotal(): number {

    return this.cartService.getTotalPrice();

  }


  get delivery(): number {

    return this.subtotal >= 499
      ? 0
      : 49;

  }


  get total(): number {

    return this.subtotal + this.delivery;

  }


  async placeOrder(): Promise<void> {

    this.error = '';
    this.success = '';


    if (this.cart.length === 0) {

      this.error =
        'Your cart is empty.';

      return;

    }


    if (
      !this.customer.fullName ||
      !this.customer.phone ||
      !this.customer.address ||
      !this.customer.city ||
      !this.customer.state ||
      !this.customer.pincode
    ) {

      this.error =
        'Please fill all delivery details.';

      return;

    }


    const user =
      this.authService.getCurrentUser();


    if (!user) {

      this.error =
        'Please login before placing an order.';

      return;

    }


    this.processing = true;


    const result =
      await this.orderService.createOrder({

        user_id: user.id,

        items: this.cart,

        total_amount: this.total,

        shipping_address:
          `${this.customer.fullName}, ` +
          `${this.customer.phone}, ` +
          `${this.customer.address}, ` +
          `${this.customer.city}, ` +
          `${this.customer.state}, ` +
          `${this.customer.pincode}`

      });


    if (result.error) {

      this.error =
        result.error.message ||
        'Unable to place order.';

      this.processing = false;

      return;

    }


    this.cartService.clearCart();

    this.success =
      'Order placed successfully!';


    this.processing = false;


    setTimeout(() => {

      this.router.navigate([
        '/orders'
      ]);

    }, 1000);

  }

}