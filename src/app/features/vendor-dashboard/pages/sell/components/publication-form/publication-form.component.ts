import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../../../../core/models/category';
import { PublicationType } from '../../sell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publication-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './publication-form.component.html',
  styleUrl: './publication-form.component.css'
})
export class PublicationFormComponent {
  productForm = input.required<FormGroup>();

  categories = input.required<Category[]>();

  publicationType = input.required<PublicationType>();

  typeChange = output<PublicationType>();
}
