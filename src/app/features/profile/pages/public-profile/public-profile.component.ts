
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';

import { UserService } from '../service/user.service';
import { User } from '../../../../core/models/user';
import { Publication } from '../../../../core/models/publicacion';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Router } from '@angular/router';
import { PublicationImages } from '../../../../core/models/publication-images';
import { DatePipe } from '@angular/common';
import { PublicationCardComponent } from '../../components/publication-card/publication-card.component';
import { ProfileInfoSectionComponent } from '../../components/profile-info-section/profile-info-section.component';
import { PublicationFiltersComponent } from '../../components/publication-filters/publication-filters.component';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    PublicationCardComponent
    ,ProfileInfoSectionComponent
    ,PublicationFiltersComponent
    ,DatePipe],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css'
})
export class PublicProfileComponent {

  private readonly userService = inject(UserService);
  private readonly publicationService = inject(PublicationService);
  private readonly router = inject(Router);

  // Usuario del perfil
  readonly userId = input<string>();

  readonly user = signal<User | null>(null);

  // Publicaciones obtenidas desde el servicio
  readonly publications = signal<Publication[]>([]);

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

  constructor() {
    effect(() => {
      const id = this.userId();

      if (id) {
        this.fetchUser(id);
        this.loadPublications(id);
      }
    });
  }

  private fetchUser(id: string): void {
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }

  private loadPublications(userId: string): void {

    this.publicationService.getAll().subscribe({
      next: (data: Publication[]) => {

        // Mostramos solamente las publicaciones del usuario del perfil
        const userPublications = data.filter(
          publication => publication.userId === userId
        );

        this.publications.set(userPublications);
      },

      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

  // OBTENER CATEGORIA

  getCategoryName(publication: Publication): string {

    const category = publication.category as unknown as {
      name?: string;
      nombre?: string;
      title?: string;
    };

    return category?.name ??
           category?.nombre ??
           category?.title ??
           '';
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


  // CONTADORES

  readonly totalCount = computed(
    () => this.publications().length
  );

  readonly priceProgress = computed(() => {

    return (
      (this.maxPrice() - this.minPriceLimit) /
      (this.maxPriceLimit - this.minPriceLimit)
    ) * 100;

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
