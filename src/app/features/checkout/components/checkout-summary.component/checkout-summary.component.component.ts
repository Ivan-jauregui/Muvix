import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  heroKey,
  heroLockClosed,
  heroShieldCheck,
  heroCheckCircle,
  heroWallet
} from '@ng-icons/heroicons/outline';

import { Publication } from '../../../../core/models/publicacion';
import { User } from '../../../../core/models/user';
import { DeliveryMethod } from '../delivery-method/delivery-method.component';
import { Router } from '@angular/router';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'checkout-summary',
  imports: [NgIcon],
  providers: [
    provideIcons({
      heroKey,
      heroLockClosed,
      heroShieldCheck,
      heroCheckCircle,
      heroWallet
    })
  ],
  templateUrl: './checkout-summary.component.component.html',
  styleUrl: './checkout-summary.component.component.css',
  host: {
    'class': 'block lg:col-span-5 min-w-0 w-full'
  }
})
export class CheckoutSummaryComponent{

  publication = input.required<PublicationResponse>();

  seller = input<User | null>(null);

  deliveryMethod = input.required<DeliveryMethod>();

  subtotal = input.required<number>();

  deliveryCost = input.required<number>();

  total = input.required<number>();

  checkout = output<void>();

  // CONFIRMAR COMPRA
  confirmCheckout(): void {
    this.checkout.emit();
  }
}
