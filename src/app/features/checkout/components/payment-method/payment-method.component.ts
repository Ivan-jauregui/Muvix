import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

export type PaymentMethod = 'card' | 'transfer' | 'mercadopago';

@Component({
  selector: 'payment-method',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon
  ],
  templateUrl: './payment-method.component.html'
})
export class PaymentMethodComponent {

  // Recibe el método seleccionado desde el padre
  paymentMethod = input.required<PaymentMethod>();

  // Notifica al padre cuando cambia el método
  paymentMethodChange = output<PaymentMethod>();

  // Recibe el formulario de tarjeta del padre
  cardForm = input.required<FormGroup>();

  selectPayment(method: PaymentMethod): void {
    this.paymentMethodChange.emit(method);
  }
}