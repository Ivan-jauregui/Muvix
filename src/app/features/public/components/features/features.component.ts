import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBolt,
  heroShieldCheck,
  heroTag
} from '@ng-icons/heroicons/outline';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'features',
    imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBolt,
      heroShieldCheck,
      heroTag
    })
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
    features: FeatureItem[] = [
    {
      id: 1,
      title: 'Venta Acelerada por Mudanza',
      description: 'Publicá el contenido de tu hogar en minutos. Armá lotes por espacio para liberar el departamento antes de entregar la propiedad.',
      icon: 'heroBolt'
    },
    {
      id: 2,
      title: 'Reserva y Pagos Protegidos',
      description: 'Fondos en custodia hasta el retiro o entrega conforme. Transacciones transparentes y seguras para ambas partes.',
      icon: 'heroShieldCheck'
    },
    {
      id: 3,
      title: 'Precios por Liquidación',
      description: 'Accedé a muebles y artículos de calidad a una fracción de su valor original por el apuro de mudanza del vendedor.',
      icon: 'heroTag'
    }
  ];
}
