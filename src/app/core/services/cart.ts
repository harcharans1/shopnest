import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartProduct {

  id: number;

  name: string;

  category: string;

  price: number;

  oldPrice: number;

  rating: number;

  reviews: number;

  discount: number;

  image: string;

  quantity: number;

}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly storageKey =
    'shopnest-cart';


  private cartSubject =
    new BehaviorSubject<CartProduct[]>(
      this.loadCart()
    );


  cart$ =
    this.cartSubject.asObservable();


  // =========================
  // GET CART
  // =========================

  getCart(): CartProduct[] {

    return this.cartSubject.value;

  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(
    product: Omit<CartProduct, 'quantity'>
  ): void {

    const cart = [
      ...this.cartSubject.value
    ];


    const existingProduct =
      cart.find(
        item => item.id === product.id
      );


    if (existingProduct) {

      existingProduct.quantity++;

    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }


    this.updateCart(cart);

  }


  // =========================
  // INCREASE
  // =========================

  increaseQuantity(
    id: number
  ): void {

    const cart = [
      ...this.cartSubject.value
    ];


    const product =
      cart.find(
        item => item.id === id
      );


    if (!product) {

      return;

    }


    product.quantity++;


    this.updateCart(cart);

  }


  // =========================
  // DECREASE
  // =========================

  decreaseQuantity(
    id: number
  ): void {

    const cart = [
      ...this.cartSubject.value
    ];


    const product =
      cart.find(
        item => item.id === id
      );


    if (!product) {

      return;

    }


    if (product.quantity > 1) {

      product.quantity--;

      this.updateCart(cart);

      return;

    }


    this.removeFromCart(id);

  }


  // =========================
  // REMOVE
  // =========================

  removeFromCart(
    id: number
  ): void {

    const cart =
      this.cartSubject.value.filter(
        item => item.id !== id
      );


    this.updateCart(cart);

  }


  // =========================
  // CLEAR CART
  // =========================

  clearCart(): void {

    this.updateCart([]);

  }


  // =========================
  // TOTAL ITEMS
  // =========================

  getTotalItems(): number {

    return this.cartSubject.value.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }


  // =========================
  // TOTAL PRICE
  // =========================

  getTotalPrice(): number {

    return this.cartSubject.value.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  }


  // =========================
  // SINGLE PRODUCT QUANTITY
  // =========================

  getProductQuantity(
    id: number
  ): number {

    const product =
      this.cartSubject.value.find(
        item => item.id === id
      );


    return product?.quantity ?? 0;

  }


  // =========================
  // CHECK PRODUCT
  // =========================

  isInCart(
    id: number
  ): boolean {

    return this.cartSubject.value.some(
      item => item.id === id
    );

  }


  // =========================
  // UPDATE CART
  // =========================

  private updateCart(
    cart: CartProduct[]
  ): void {

    this.cartSubject.next(cart);


    localStorage.setItem(
      this.storageKey,
      JSON.stringify(cart)
    );

  }


  // =========================
  // LOAD CART
  // =========================

  private loadCart(): CartProduct[] {

    try {

      const savedCart =
        localStorage.getItem(
          this.storageKey
        );


      if (!savedCart) {

        return [];

      }


      const cart =
        JSON.parse(savedCart);


      if (!Array.isArray(cart)) {

        return [];

      }


      return cart;

    } catch {

      return [];

    }

  }

}