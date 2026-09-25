import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';

@Component({ selector: 'app-navbar', standalone: true, imports: [RouterLink], templateUrl: './navbar.html', styleUrl: './navbar.scss' })
export class Navbar implements OnInit, OnDestroy {
  searchText = '';
  cartCount = 0;
  wishlistCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cart$.subscribe(cart => {
        this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      }),
      this.wishlistService.wishlist$.subscribe(wishlist => {
        this.wishlistCount = wishlist.length;
      })
    );
  }

  onSearchInput(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  searchProducts(event: Event): void {
    event.preventDefault();
    const search = this.searchText.trim();
    this.router.navigate(['/products'], { queryParams: search ? { search } : {} });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}