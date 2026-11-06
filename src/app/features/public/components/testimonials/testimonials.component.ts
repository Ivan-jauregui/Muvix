import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroStarSolid, heroShieldCheckSolid, heroUserGroupSolid, heroSparklesSolid } from '@ng-icons/heroicons/solid';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatarText: string;
  comment: string;
  rating: number;
}

@Component({
  selector: 'testimonials',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [
    provideIcons({ 
      heroStarSolid, 
      heroShieldCheckSolid, 
      heroUserGroupSolid, 
      heroSparklesSolid 
    })
  ],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Camila R.',
      role: 'Vendedora',
      avatarText: 'CR',
      comment: 'Entregaba el depto en 4 días y me quedaba el juego de comedor y el rack. Armé el lote en Muvix y un solo comprador retiró todo en flete. Me salvó el depósito.',
      rating: 5
    },
    {
      id: 2,
      name: 'Gonzalo M.',
      role: 'Comprador',
      avatarText: 'GM',
      comment: 'Conseguí un sillón y mesa de madera maciza a menos de la mitad de lo que valen nuevos. La reserva con fondos en custodia me dio la tranquilidad para transferir.',
      rating: 5
    },
    {
      id: 3,
      name: 'Lucía & Tomás',
      role: 'Vendedores',
      avatarText: 'LT',
      comment: 'La mejor experiencia para evitar visitas dudosas. Validaron al comprador antes del retiro y cobramos al instante por PIN en la entrega.',
      rating: 5
    }
  ];
}