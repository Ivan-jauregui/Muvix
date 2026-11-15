import { Component, inject, signal,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { PublicationImageService } from '../../../../core/services/publication-image/publication-image.service';
import { Publication } from '../../../../core/models/publicacion';
import { PublicationImages } from '../../../../core/models/publication-images';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell.component.html'
})
export class SellComponent{

}