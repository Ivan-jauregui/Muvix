import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { UserService } from '../../../profile/pages/service/user.service';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../core/models/user';
import { Publication } from '../../../../core/models/publicacion';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private  readonly publicationService = inject(PublicationService);

  publication = signal<Publication|null>(null)
  seller = signal<User|null>(null)

  pinDigits: string[] = ['4', '8', '2', '9'];

  id = input<string>(); 

  ngOnInit(): void {
       const prodId = this.id();

      if (prodId ) {
        this.loadData(prodId);
      }
  }



  loadData(publicationId: string): void {
     this.publicationService.getById(publicationId).subscribe({
      next: data => this.publication.set(data), 
      error: err => console.error('Error al cargar la publicación', err)
    });
    
    const sellerId = this.publication()?.userId
    
    this.userService.getById(sellerId!).subscribe({
      next: user => this.seller.set(user), 
      error: err => console.error('Error al cargar el usuario', err)
    });

   
  }

  copyAddress(): void {
    const addressText = 'Honduras 4872, Piso 1, Dpto B, Palermo Soho, CABA';
    navigator.clipboard.writeText(addressText);
  }

  copyPin(): void {
    navigator.clipboard.writeText(this.pinDigits.join(''));
  }

  openGoogleMaps(): void {
    window.open('https://maps.google.com/?q=Honduras+4872+Palermo+Soho+CABA', '_blank');
  }

  openWaze(): void {
    window.open('https://waze.com/ul?q=Honduras+4872+Palermo+Soho+CABA', '_blank');
  }

  coordinateDayAndHour(): void {
    console.log('Abriendo chat con el vendedor...');
  }

  changeAuthorizedPerson(): void {
    console.log('Modificando persona autorizada...');
  }

  viewDigitalReceipt(): void {
    console.log('Mostrando comprobante QR...');
  }

  downloadPdf(): void {
    console.log('Descargando comprobante PDF...');
  }

  openResolutionCenter(): void {
    console.log('Abriendo centro de resolución...');
  }
}
