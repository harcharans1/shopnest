import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home)
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products')
        .then(m => m.Products)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.Cart)
  },

  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories')
        .then(m => m.Categories)
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout')
        .then(m => m.Checkout)
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products')
        .then(m => m.Products)
  },

{
  path: 'wishlist',
  loadComponent: () =>
    import('./features/wishlist/wishlist')
      .then(m => m.Wishlist)
},

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/product-details/product-details')
        .then(m => m.ProductDetails)
  },
  {
    path: '**',
    redirectTo: ''
  }

];