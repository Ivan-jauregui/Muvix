import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
activeTab: 'compradores' | 'vendedores' = 'compradores';

  faqs = [
    {
      question: '¿Qué ocurre si voy al departamento y el producto no condice con las fotos?',
      answer: 'Si al retirar notas daños no informados, no des el PIN. Tocá \'Reportar incidente\' para cancelar y recibir el reintegro total inmediato.'
    },
    {
      question: '¿Cómo y cuándo se le entrega el PIN de 4 dígitos al vendedor?',
      answer: 'El PIN de liberación solo se le dicta al vendedor o responsable autorizado una vez que hayas ingresado al inmueble, revisado personalmente los muebles y confirmado que coinciden al 100% con la publicación.'
    },
    {
      question: '¿Muvix provee flete con peones para bajar muebles pesados?',
      answer: 'Sí, podés coordinar fletes oficiales certificados con personal especializado en mudanzas y elementos de protección para ascensores y pasillos directamente desde la plataforma.'
    },
    {
      question: '¿Cómo verifican que la persona realmente se está mudando?',
      answer: 'Cada liquidación pasa por un riguroso protocolo de validación de identidad, titularidad del inmueble o documentación de relocalización antes de habilitar los lotes.'
    }
  ];

  setTab(tab: 'compradores' | 'vendedores'): void {
    this.activeTab = tab;
  }
}
