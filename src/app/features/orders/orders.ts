import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {

  orders: any[] = [];

  ngOnInit(): void {

    const savedOrders =
      localStorage.getItem('shopnest-orders');

    if (savedOrders) {

      try {

        this.orders =
          JSON.parse(savedOrders);

      } catch {

        this.orders = [];

      }

    }

  }

  cancelOrder(index: number): void {

    const confirmed =
      confirm(
        'Are you sure you want to cancel this order?'
      );

    if (!confirmed) {
      return;
    }

    this.orders[index].status =
      'Cancelled';

    localStorage.setItem(
      'shopnest-orders',
      JSON.stringify(this.orders)
    );

  }

}