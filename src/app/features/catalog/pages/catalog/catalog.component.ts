import { Component, computed, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PublicationImages } from '../../../../core/models/publication-images';
import { PublicationFilterComponent } from '../../components/publication-filter/publication-filter.component';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, RouterLink,PublicationFilterComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  private router = inject(Router)
  private publicationService = inject(PublicationService);

  public publications = signal<Publication[]>([]);

  // Filtros
  readonly search = signal('');
  readonly selectedCategory = signal('Todo');
  readonly condition = signal<string | null>(null);
  readonly maxPrice = signal(195000);
  readonly sortBy = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  readonly minPriceLimit = 10000;
  readonly maxPriceLimit = 195000;

   readonly categories = [
    'Todo',
    'Living & Estar',
    'Comedor & Sillas',
    'Cocina & Bazar',
    'Iluminación & Deco'
  ];

  readonly conditions = [
    'Como nuevo',
    'Muy Bueno',
    'A Estrenar'
  ];

  ngOnInit(): void {
    this.loadPublications();
  }

  private loadPublications(): void {
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.publications.set(data);
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones:', err);
      }
    });
  }

  getMainImageUrl(publication: Publication): string {
    const images = publication?.images;
    if (!images || images.length === 0) return 'assets/no-image.jpg';

    // Busca la principal, si no existe, agarra la primera del array
    const principal = images.find((img: PublicationImages) => img.esPrincipal);
 
    return principal ? principal.url_images : images[0].url_images;
  }


  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }


  
 getCategoryName(publication: Publication): string {
  return publication.category?.name ?? '';
}

   // PUBLICACIONES FILTRADAS

  readonly filtered = computed(() => {

    const query = this.search().trim().toLowerCase();

    const selectedCategory = this.selectedCategory();

    const selectedCondition = this.condition();

    const maxPrice = this.maxPrice();

    const list = this.publications().filter(publication => {
      const matchesSearch =
        !query ||
        publication.title.toLowerCase().includes(query) ||
        publication.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'Todo' ||
        this.getCategoryName(publication) === selectedCategory;

      const matchesCondition =
        !selectedCondition ||
        publication.condition === selectedCondition;

      const matchesPrice =
        publication.price <= maxPrice;

      return matchesSearch &&
             matchesCategory &&
             matchesCondition &&
             matchesPrice;
    });

    const sort = this.sortBy();
    return [...list].sort((a, b) => {

      if (sort === 'priceAsc') {
        return a.price - b.price;
      }

      if (sort === 'priceDesc') {
        return b.price - a.price;
      }

      return new Date(b.createdAt).getTime() -
             new Date(a.createdAt).getTime();
    });
  });

  categoryCount(category: string): number {

    if (category === 'Todo') {
      return this.publications().length;
    }

    return this.publications().filter(
      publication =>
        this.getCategoryName(publication) === category
    ).length;
  }

  conditionCount(condition: string): number {

    return this.publications().filter(
      publication => publication.condition === condition
    ).length;
  }

  // ACCIONES DE FILTROS

  clearFilters(): void {

    this.search.set('');
    this.selectedCategory.set('Todo');
    this.condition.set(null);
    this.maxPrice.set(this.maxPriceLimit);
    this.sortBy.set('newest');

  }

  onSort(event: Event): void {

    const value = (event.target as HTMLSelectElement).value;

    this.sortBy.set(
      value as 'newest' | 'priceAsc' | 'priceDesc'
    );

  }

  onPrice(event: Event): void {

    this.maxPrice.set(
      +(event.target as HTMLInputElement).value
    );

  }

  onSearch(event: Event): void {

    this.search.set(
      (event.target as HTMLInputElement).value
    );

  }

  toggleCondition(condition: string): void {

    this.condition.set(
      this.condition() === condition
        ? null
        : condition
    );

  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

}
