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

  private readonly router = inject(Router);

  // DATOS RECIBIDOS DEL PADRE
  publication = input.required<Publication>();

  seller = input<User | null>(null);

  deliveryMethod = input.required<DeliveryMethod>();

  subtotal = input.required<number>();

  deliveryCost = input.required<number>();

  total = input.required<number>();

  // EVENTO HACIA EL PADRE
  checkout = output<void>();

  // IMAGEN PRINCIPAL
  getMainImageUrl(publication: Publication): string {

    const images = publication.images ?? [];

    const mainImage = images.find(image => image.esPrincipal);

    return mainImage?.url_images
      ?? images[0]?.url_images
      ?? 'assets/no-image.jpg';
  }

  // CONFIRMAR COMPRA
  confirmCheckout(): void {
    //COMENTADA PERO IMPOTANTE
    //this.checkout.emit();
     this.router.navigate(["/checkout/success",this.publication().id])
  }

}
