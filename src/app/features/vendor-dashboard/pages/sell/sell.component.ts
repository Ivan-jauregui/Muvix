import { Component, OnInit, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  imports: [CommonModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent{
  
}
