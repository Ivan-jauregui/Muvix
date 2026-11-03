import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

export type DeliveryMethod = 'pickup' | 'shipping';

@Component({
  selector: 'delivery-method',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './delivery-method.component.html'
})
export class DeliveryMethodComponent {

  deliveryMethod = input.required<DeliveryMethod>();

  deliveryMethodChange = output<DeliveryMethod>();

  selectDelivery(method: DeliveryMethod): void {
    this.deliveryMethodChange.emit(method);
  }
}