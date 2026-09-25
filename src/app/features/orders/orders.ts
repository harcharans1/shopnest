import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase';

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string | number;
  userId?: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private supabase: SupabaseService
  ) {}

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get orders error:', error);
        return [];
      }

      return (data ?? []) as Order[];

    } catch (error) {
      console.error('Orders error:', error);
      return [];
    }
  }

  async getOrderById(id: string | number): Promise<Order | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Get order error:', error);
        return null;
      }

      return data as Order | null;

    } catch (error) {
      console.error('Order details error:', error);
      return null;
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      const { data, error } = await this.supabase.client
        .from('orders')
        .insert(order)
        .select()
        .single();

      if (error) {
        console.error('Create order error:', error);
        return null;
      }

      return data as Order;

    } catch (error) {
      console.error('Create order error:', error);
      return null;
    }
  }

  async cancelOrder(id: string | number): Promise<boolean> {
    try {
      const { error } = await this.supabase.client
        .from('orders')
        .update({
          status: 'cancelled'
        })
        .eq('id', id);

      if (error) {
        console.error('Cancel order error:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Cancel order error:', error);
      return false;
    }
  }
}