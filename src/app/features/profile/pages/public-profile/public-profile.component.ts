import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../service/user.service';
import { User } from '../../../../core/models/user';
import { Category } from '../../../../core/models/category';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';

import { PublicationService } from '../../../../core/services/publication/publication-service';
import { CategoryService } from '../../../../core/services/category/category.service';

import { PublicationCardComponent } from '../../components/publication-card/publication-card.component';
import { ProfileInfoSectionComponent } from '../../components/profile-info-section/profile-info-section.component';
import { PublicationFiltersComponent } from '../../components/publication-filters/publication-filters.component';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    CommonModule,
    PublicationCardComponent,
    ProfileInfoSectionComponent,
    PublicationFiltersComponent
  ],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css'
})
export class PublicProfileComponent implements OnInit {

  // SERVICIOS
  private readonly userService = inject(UserService);
  private readonly publicationService = inject(PublicationService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Solo se completa si el router tiene withComponentInputBinding()
  readonly userId = input<string>();

  // ESTADO
  readonly user = signal<User | null>(null);
  readonly publications = signal<PublicationResponse[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly showFilters = signal(false);

  // Nombres de categorías para el componente de filtros (espera string[])
  readonly categoryNames = computed(() =>
    this.categories().map(c => c.name)
  );

  readonly totalCount = computed(() => this.publications().length);

  // FILTROS
  readonly search = signal('');
  readonly selectedCategory = signal('Todo');
  readonly condition = signal<string | null>(null);
  readonly sortBy = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  readonly maxPrice = signal(500000);
  readonly minPriceLimit = 10000;
  readonly maxPriceLimit = 500000;

  readonly conditions = [
    'Nuevo',
    'Como nuevo',
    'Buen estado',
    'Regular',
  ];

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
        publication.category === selectedCategory;

      const matchesCondition =
        !selectedCondition ||
        publication.item?.some(item => item.condition === selectedCondition);

      const matchesPrice = publication.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    });

    const sort = this.sortBy();

    return [...list].sort((a, b) => {
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;

      return new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();
    });
  });

  // CARGA DE DATOS
  ngOnInit(): void {
    this.loadCategories();

    // Si navegás de un perfil a otro, el componente se reutiliza
    // y paramMap emite de nuevo, así que se recarga solo.
    this.route.paramMap.subscribe(params => {
      const id =
        this.userId() ??
        params.get('id') ??
        params.get('userId');

      if (!id) {
        console.error('No se encontró el id del usuario en la ruta');
        return;
      }

      this.user.set(null);
      this.publications.set([]);
      this.loadUser(id);
      this.loadPublications(id);
    });
  }

  private loadUser(id: string): void {
    this.userService.getById(id).subscribe({
      next: user => this.user.set(user),
      error: err => console.error('Error al cargar el usuario:', err)
    });
  }

  private loadPublications(id: string): void {
    this.publicationService.getPublicationsByUserId(id).subscribe({
      next: data => this.publications.set(data),
      error: err => console.error('Error al cargar las publicaciones:', err)
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: data => this.categories.set(data),
      error: err => console.error('Error al obtener las categorías:', err)
    });
  }

  // CONTADORES
  categoryCount(category: string): number {
    if (category === 'Todo') {
      return this.publications().length;
    }

    return this.publications().filter(
      publication => publication.category === category
    ).length;
  }

  conditionCount(condition: string): number {
    return this.publications().filter(publication =>
      publication.item?.some(storageItem => storageItem.condition === condition)
    ).length;
  }

  // ACCIONES
  clearFilters(): void {
    this.search.set('');
    this.selectedCategory.set('Todo');
    this.condition.set(null);
    this.maxPrice.set(this.maxPriceLimit);
    this.sortBy.set('newest');
  }

  onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value as 'newest' | 'priceAsc' | 'priceDesc');
  }

  toggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  toggleCondition(condition: string): void {
    this.condition.set(
      this.condition() === condition ? null : condition
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/catalog', id]);
  }
}