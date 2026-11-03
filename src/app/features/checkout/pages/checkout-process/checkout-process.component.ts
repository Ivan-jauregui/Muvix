import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// MODELOS
import { Publication } from '../../../../core/models/publicacion';
import { User } from '../../../../core/models/user';
import { DeliveryMethod } from '../../components/delivery-method/delivery-method.component';

// SERVICIOS
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { UserService } from '../../../profile/pages/service/user.service';

// ICONOS
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroMapPin,
  heroTruck,
  heroShieldCheck,
  heroLockClosed,
  heroCreditCard,
  heroBuildingLibrary,
  heroWallet,
  heroKey,
  heroCheckCircle,
  heroShoppingCart
} from '@ng-icons/heroicons/outline';

// COMPONENTES
import { PickupDataComponent } from '../../components/pickup-data/pickup-data.component';
import { DeliveryMethodComponent } from '../../components/delivery-method/delivery-method.component';
import { PaymentMethod, PaymentMethodComponent } from '../../components/payment-method/payment-method.component';
import { CheckoutSummaryComponent } from '../../components/checkout-summary.component/checkout-summary.component.component';

@Component({
  selector: 'app-checkout-process',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIcon,
    PickupDataComponent,
    DeliveryMethodComponent,
    PaymentMethodComponent,
    CheckoutSummaryComponent
  ],

  providers: [
    provideIcons({
      heroMapPin,
      heroTruck,
      heroShieldCheck,
      heroLockClosed,
      heroCreditCard,
      heroBuildingLibrary,
      heroWallet,
      heroKey,
      heroCheckCircle,
      heroShoppingCart
    })
  ],

  templateUrl: './checkout-process.component.html',
  styleUrl: './checkout-process.component.css'
})
export class CheckoutProcessComponent {

  // SERVICIOS
  private readonly route = inject(ActivatedRoute);
  private readonly publicationService = inject(PublicationService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  // PUBLICACIÓN
  readonly publication = signal<Publication | null>(null);

  // VENDEDOR
  readonly seller = signal<User | null>(null);

  // ESTADOS DEL CHECKOUT
  readonly deliveryMethod = signal<DeliveryMethod>('pickup');

  readonly paymentMethod = signal<PaymentMethod>('card');

  // FORMULARIO DE DATOS DE RETIRO
  readonly pickupForm = this.fb.group({
    firstName: ['', Validators.required],

    dni: ['', [
      Validators.required,
      Validators.pattern(/^\d{7,8}$/)
    ]],

    whatsapp: ['', [
      Validators.required,
      Validators.pattern(/^\+?[\d\s()-]{8,20}$/)
    ]],

    email: ['', [
      Validators.required,
      Validators.email
    ]]
  });

  // FORMULARIO DE PAGO 
  readonly cardForm = this.fb.group({
    cardNumber: [''],
    cardHolder: [''], 
    cardExpiry: [''],
    cardCvv: ['']
  });

  // COSTOS
  readonly shippingPrice = 5800;

  readonly deliveryCost = computed(() =>
    this.deliveryMethod() === 'shipping'
      ? this.shippingPrice
      : 0
  );

  readonly subtotal = computed(() =>
    this.publication()?.price ?? 0
  );

  readonly total = computed(() =>
    this.subtotal() + this.deliveryCost()
  );

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadPublication(id);
      }
    });
  }

  // CARGAR PUBLICACIÓN
  private loadPublication(id: string): void {

    this.publicationService.getById(id).subscribe({
      next: data => {
        this.publication.set(data);

        // CARGAR VENDEDOR
        if (data.userId) {
          this.loadSeller(data.userId);
        }
      },

      error: error => {
        console.error('Error al cargar publicación:', error);
      }
    });
  }

  // CARGAR VENDEDOR
  private loadSeller(userId: string): void {

    this.userService.getById(userId).subscribe({
      next: user => this.seller.set(user),

      error: error => {
        console.error('Error al cargar vendedor:', error);
      }
    });
  }

  // IMAGEN PRINCIPAL
  getMainImageUrl(publication: Publication): string {

    const images = publication.images ?? [];

    const mainImage = images.find(image => image.esPrincipal);

    return mainImage?.url_images
      ?? images[0]?.url_images
      ?? 'assets/no-image.jpg';
  }

  // MÉTODO DE RETIRO O ENTREGA
  selectDelivery(method: DeliveryMethod): void {
    this.deliveryMethod.set(method);
  }

  // MÉTODO DE PAGO
  selectPayment(method: PaymentMethod): void {
  this.paymentMethod.set(method);
}

  // CONFIRMAR CHECKOUT
  confirmCheckout(): void {

    if (this.pickupForm.invalid) {
      this.pickupForm.markAllAsTouched();
      return;
    }

    const pickupData = this.pickupForm.getRawValue();

    console.log('Método de entrega:', this.deliveryMethod());
    console.log('Método de pago:', this.paymentMethod());
    console.log('Datos de retiro:', pickupData);
    console.log('Total:', this.total());
  }



}