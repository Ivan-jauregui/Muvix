import { Component, inject, signal,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicationService } from '../../../../core/services/publication/publication-service';


@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell.component.html'
})
export class SellComponent{

}