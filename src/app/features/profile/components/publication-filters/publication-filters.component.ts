import { Component, input, output } from '@angular/core';

@Component({
  selector: 'publication-filters',
  imports: [],
  templateUrl: './publication-filters.component.html',
  styleUrl: './publication-filters.component.css'
})
export class PublicationFiltersComponent {

  // Datos recibidos del padre
  categories = input.required<string[]>();
  conditions = input.required<string[]>();

  selectedCategory = input.required<string>();
  selectedCondition = input<string | null>(null);

  search = input.required<string>();
  maxPrice = input.required<number>();

  minPriceLimit = input.required<number>();
  maxPriceLimit = input.required<number>();

  // Eventos enviados al padre
  clear = output<void>();
  searchChange = output<string>();
  categoryChange = output<string>();
  conditionChange = output<string>();
  priceChange = output<number>();

  // Contadores
  categoryCount = input.required<(category: string) => number>();
  conditionCount = input.required<(condition: string) => number>();
}
