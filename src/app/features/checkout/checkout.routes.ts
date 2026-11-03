import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
   { 
    path: 'success/:id', 
    loadComponent: () => import('./pages/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent) 
  },
  { 
    path: ':id', 
    loadComponent: () => import('./pages/checkout-process/checkout-process.component').then(m => m.CheckoutProcessComponent) 
  }
];