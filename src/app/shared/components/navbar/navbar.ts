import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  CartService
} from '../../../core/services/cart';

import {
  WishlistService
} from '../../../core/services/wishlist';


@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.scss'
})


export class Navbar implements OnInit, OnDestroy {


  // =========================================
  // SEARCH
  // =========================================

  searchText = '';


  // =========================================
  // CART
  // =========================================

  cartCount = 0;


  // =========================================
  // WISHLIST
  // =========================================

  wishlistCount = 0;


  // =========================================
  // SUBSCRIPTIONS
  // =========================================

  private subscriptions: Subscription[] = [];



  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(

    private router: Router,

    private cartService: CartService,

    private wishlistService: WishlistService

  ) {}



  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.loadCartCount();

    this.loadWishlistCount();

  }



  // =========================================
  // CART COUNT
  // =========================================

  private loadCartCount(): void {

    try {

      const service = this.cartService as any;


      /*
       * Different CartService implementations
       * can use different methods.
       */

      if (
        typeof service.getCartCount === 'function'
      ) {

        this.cartCount =
          service.getCartCount();

      }

      else if (
        typeof service.getCart === 'function'
      ) {

        const cart =
          service.getCart();

        this.cartCount =
          Array.isArray(cart)
            ? cart.length
            : 0;

      }

      else {

        this.cartCount = 0;

      }

    }

    catch {

      this.cartCount = 0;

    }

  }



  // =========================================
  // WISHLIST COUNT
  // =========================================

  private loadWishlistCount(): void {

    try {

      const service =
        this.wishlistService as any;


      if (
        typeof service.getWishlist === 'function'
      ) {

        const wishlist =
          service.getWishlist();


        this.wishlistCount =
          Array.isArray(wishlist)
            ? wishlist.length
            : 0;

      }

      else if (
        typeof service.getWishlistCount === 'function'
      ) {

        this.wishlistCount =
          service.getWishlistCount();

      }

      else {

        this.wishlistCount = 0;

      }

    }

    catch {

      this.wishlistCount = 0;

    }

  }



  // =========================================
  // SEARCH INPUT
  // =========================================

  onSearchInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    this.searchText =
      input.value;

  }



  // =========================================
  // SEARCH PRODUCTS
  // =========================================

  searchProducts(
    event: Event
  ): void {

    event.preventDefault();


    const search =
      this.searchText.trim();


    if (!search) {

      this.router.navigate([
        '/products'
      ]);

      return;

    }


    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: search
        }
      }
    );

  }



  // =========================================
  // DESTROY
  // =========================================

  ngOnDestroy(): void {

    this.subscriptions.forEach(
      subscription =>
        subscription.unsubscribe()
    );

  }

}