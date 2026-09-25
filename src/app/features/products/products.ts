import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../core/services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  dealOnly = false;
  sortOption = 'default';

  categories = ['All', 'Mobiles', 'Laptops', 'Audio', 'Fashion', 'Wearables', 'Home', 'Beauty', 'Grocery', 'Sports', 'Accessories', 'Electronics'];

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('search') ?? '';
      const category = params.get('category');
      this.selectedCategory = category && category !== 'all' ? this.normalizeCategory(category) : 'All';
      this.dealOnly = params.get('deal') === 'true';
      this.applyFilters();
    });
  }

  private normalizeCategory(category: string): string {
    const map: Record<string, string> = {
      'Home & Kitchen': 'Home',
      'Electronics': 'Audio'
    };
    return map[category] ?? category;
  }

  filterCategory(category: string): void { this.selectedCategory = category; this.applyFilters(); }
  searchProducts(): void { this.applyFilters(); }
  sortProducts(): void { this.applyFilters(); }

  applyFilters(): void {
    let result = [...this.products];
    const search = this.searchTerm.trim().toLowerCase();
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
    if (this.selectedCategory !== 'All') result = result.filter(p => p.category.toLowerCase() === this.selectedCategory.toLowerCase());
    if (this.dealOnly) result = result.filter(p => !!p.discount && p.discount > 0);
    if (this.sortOption === 'low') result.sort((a,b) => a.price - b.price);
    else if (this.sortOption === 'high') result.sort((a,b) => b.price - a.price);
    else if (this.sortOption === 'rating') result.sort((a,b) => b.rating - a.rating);
    this.filteredProducts = result;
  }

  trackProduct(index: number, product: Product): number { return product.id; }
}