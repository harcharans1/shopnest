import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartProduct, CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-checkout', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html', styleUrl: './checkout.scss'
})
export class Checkout {
  cart: CartProduct[] = [];
  processing = false;
  error = '';
  success = '';
  customer = { fullName: '', phone: '', address: '', city: '', state: '', pincode: '' };
  paymentMethod = 'cod';

  constructor(private cartService: CartService, private authService: AuthService, private orderService: OrderService, private router: Router) {
    this.cart = this.cartService.getCart();
  }

  get subtotal(): number { return this.cartService.getTotalPrice(); }
  get delivery(): number { return this.subtotal >= 499 ? 0 : 49; }
  get total(): number { return this.subtotal + this.delivery; }

  private validPhone(): boolean { return /^[6-9]\d{9}$/.test(this.customer.phone.trim()); }
  private validPincode(): boolean { return /^\d{6}$/.test(this.customer.pincode.trim()); }

  async placeOrder(): Promise<void> {
    this.error = ''; this.success = '';
    this.cart = this.cartService.getCart();
    if (!this.cart.length) { this.error = 'Your cart is empty.'; return; }
    if (!this.customer.fullName.trim() || !this.customer.phone.trim() || !this.customer.address.trim() || !this.customer.city.trim() || !this.customer.state.trim() || !this.customer.pincode.trim()) { this.error = 'Please fill all delivery details.'; return; }
    if (!this.validPhone()) { this.error = 'Please enter a valid 10-digit Indian mobile number.'; return; }
    if (!this.validPincode()) { this.error = 'Please enter a valid 6-digit pincode.'; return; }
    const user = this.authService.getCurrentUser();
    if (!user) { this.error = 'Please login before placing an order.'; return; }
    this.processing = true;
    const result = await this.orderService.createOrder({ user_id: user.id, items: this.cart, total_amount: this.total, shipping_address: `${this.customer.fullName.trim()}, ${this.customer.phone.trim()}, ${this.customer.address.trim()}, ${this.customer.city.trim()}, ${this.customer.state.trim()}, ${this.customer.pincode.trim()}` });
    if (result.error) { this.error = result.error.message || 'Unable to place order.'; this.processing = false; return; }
    const localOrder = { id: result.data?.id ?? `SN-${Date.now()}`, createdAt: new Date().toLocaleString('en-IN'), status: 'pending', total: this.total, items: this.cart.map(item => ({ ...item })) };
    let existing: any[] = [];
    try { const parsed = JSON.parse(localStorage.getItem('shopnest-orders') || '[]'); existing = Array.isArray(parsed) ? parsed : []; } catch { existing = []; }
    localStorage.setItem('shopnest-orders', JSON.stringify([localOrder, ...existing]));
    this.cartService.clearCart();
    this.cart = [];
    this.success = 'Order placed successfully!';
    this.processing = false;
    setTimeout(() => this.router.navigate(['/orders']), 700);
  }
}