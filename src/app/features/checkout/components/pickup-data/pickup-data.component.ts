
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pickup-data',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pickup-data.component.html'
})
export class PickupDataComponent {

  form = input.required<FormGroup>();

}
