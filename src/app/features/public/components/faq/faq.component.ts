import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { 
 heroCheckCircle
} from '@ng-icons/heroicons/outline';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'faq',
  standalone: true,
   imports: [CommonModule,NgIcon],
      providers: [
        provideIcons({ 
          heroCheckCircle
        })
      ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  // Manejo del acordeón abierto con Signals
  openIndex = signal<number | null>(null);

  faqs: FaqItem[] = [
    {
      id: 1,
      question: '¿Cómo se acuerdan los días y horarios para retirar el mobiliario?',
      answer: 'Una vez confirmada la reserva en la plataforma, se habilita un canal de comunicación para coordinar la ventana horaria de retiro o la recepción del flete según el cronograma de entrega del inmueble.'
    },
    {
      id: 2,
      question: '¿Cómo funcionan las liquidaciones por fecha límite de retiro?',
      answer: 'Son publicaciones organizadas según el cronograma de mudanza del vendedor. A medida que se aproxima la fecha de entrega del departamento, la plataforma optimiza la visibilidad de los artículos para garantizar la liberación del espacio a tiempo.'
    },
    {
      id: 3,
      question: '¿Puedo comprar un lote completo de mobiliario o debo adquirir los artículos por separado?',
      answer: 'Muvix permite ambas modalidades. Podés reservar artículos individuales o adquirir el lote completo de un ambiente para amueblar un espacio a costo reducido de envío.'
    },
    {
      id: 4,
      question: '¿Qué es y cómo funciona la compra protegida en Muvix?',
      answer: 'Al reservar un artículo, el pago queda bajo custodia hasta que confirmás el retiro o la entrega conforme del mobiliario. Esto garantiza transparencia tanto para quien liquida su hogar como para quien compra.'
    },
    {
      id: 5,
      question: '¿Qué pasa si llego al departamento y el mobiliario no coincide con las fotos?',
      answer: 'Si detectás discrepancias significativas entre la publicación y el estado real del producto al momento del retiro, podés cancelar la transacción en el acto desde la aplicación para el reembolso inmediato de la reserva.'
    },
    {
      id: 6,
      question: '¿Necesitás más información o querés vaciar tu propio departamento?',
      answer: 'Si querés liquidar un inmueble completo o tenés dudas operativas específicas, podés contactar directamente a nuestro equipo de soporte para recibir asistencia personalizada.'
    }
  ];

  toggleFaq(index: number): void {
    if (this.openIndex() === index) {
      this.openIndex.set(null);
    } else {
      this.openIndex.set(index);
    }
  }
}