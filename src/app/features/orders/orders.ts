import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {
  orders: any[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    try {
      const saved = JSON.parse(localStorage.getItem('shopnest-orders') || '[]');
      this.orders = Array.isArray(saved) ? saved : [];
    } catch {
      this.orders = [];
    }
  }

  cancelOrder(index: number): void {
    if (!this.orders[index]) return;

    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    this.orders[index].status = 'cancelled';
    localStorage.setItem('shopnest-orders', JSON.stringify(this.orders));
  }

  getItems(order: any): any[] {
    return Array.isArray(order?.items)
      ? order.items
      : Array.isArray(order?.order_items)
        ? order.order_items
        : [];
  }
}