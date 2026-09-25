import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist';
import { CartService } from '../../core/services/cart';
import { Product, ProductService } from '../../core/services/product';

@Component({
  selector: 'app-product-details', standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html', styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  product?: Product;
  quantity = 1;
  selectedColor = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);
    if (this.product?.colors?.length) this.selectedColor = this.product.colors[0];
  }

  increaseQuantity(): void { this.quantity++; }
  decreaseQuantity(): void { if (this.quantity > 1) this.quantity--; }
  selectColor(color: string): void { this.selectedColor = color; }

  addToCart(): void {
    if (!this.product || !this.product.inStock) return;
    for (let i = 0; i < this.quantity; i++) {
      const { id, name, category, price, oldPrice, rating, reviews, discount, image } = this.product;
      this.cartService.addToCart({ id, name, category, price, oldPrice: oldPrice ?? price, rating, reviews, discount: discount ?? 0, image });
    }
    alert(`${this.product.name} added to cart`);
  }

  buyNow(): void {
    if (!this.product || !this.product.inStock) return;
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  toggleWishlist(): void {
    if (!this.product) return;
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return !!this.product && this.wishlistService.isInWishlist(this.product.id);
  }
}