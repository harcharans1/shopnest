import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { CartProduct } from './cart';

export interface OrderItem {

  product_id: number;

  product_name: string;

  price: number;

  quantity: number;

  image?: string;

}


export interface CreateOrderData {

  user_id: string;

  items: CartProduct[];

  total_amount: number;

  shipping_address?: string;

}


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(
    private supabaseService: SupabaseService
  ) {}


  // =========================
  // CREATE ORDER
  // =========================

  async createOrder(
    data: CreateOrderData
  ) {

    const orderItems: OrderItem[] =
      data.items.map(item => ({

        product_id: item.id,

        product_name: item.name,

        price: item.price,

        quantity: item.quantity,

        image: item.image

      }));


    const {
      data: order,
      error
    } =
      await this.supabaseService.client
        .from('orders')
        .insert({

          user_id: data.user_id,

          total_amount:
            data.total_amount,

          shipping_address:
            data.shipping_address ?? null,

          status: 'pending'

        })
        .select()
        .single();


    if (error || !order) {

      return {
        data: null,
        error
      };

    }


    const itemsWithOrderId =
      orderItems.map(item => ({

        order_id: order.id,

        ...item

      }));


    const {
      error: itemsError
    } =
      await this.supabaseService.client
        .from('order_items')
        .insert(
          itemsWithOrderId
        );


    if (itemsError) {

      return {
        data: null,
        error: itemsError
      };

    }


    return {

      data: order,

      error: null

    };

  }


  // =========================
  // GET USER ORDERS
  // =========================

  async getUserOrders(
    userId: string
  ) {

    return await this.supabaseService.client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq(
        'user_id',
        userId
      )
      .order(
        'created_at',
        {
          ascending: false
        }
      );

  }


  // =========================
  // GET SINGLE ORDER
  // =========================

  async getOrder(
    orderId: number
  ) {

    return await this.supabaseService.client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq(
        'id',
        orderId
      )
      .single();

  }


  // =========================
  // UPDATE ORDER STATUS
  // ADMIN
  // =========================

  async updateOrderStatus(
    orderId: number,
    status: string
  ) {

    return await this.supabaseService.client
      .from('orders')
      .update({
        status
      })
      .eq(
        'id',
        orderId
      )
      .select()
      .single();

  }


  // =========================
  // GET ALL ORDERS
  // ADMIN
  // =========================

  async getAllOrders() {

    return await this.supabaseService.client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order(
        'created_at',
        {
          ascending: false
        }
      );

  }


  // =========================
  // CANCEL ORDER
  // =========================

  async cancelOrder(
    orderId: number
  ) {

    return await this.supabaseService.client
      .from('orders')
      .update({
        status: 'cancelled'
      })
      .eq(
        'id',
        orderId
      )
      .select()
      .single();

  }

}