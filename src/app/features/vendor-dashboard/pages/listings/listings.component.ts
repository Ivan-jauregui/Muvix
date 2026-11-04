import { Component, OnInit, computed, inject, model, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { Router } from '@angular/router';
import { heroFunnelMicro } from '@ng-icons/heroicons/micro';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Category } from '../../../../core/models/category';
import { FormsModule } from '@angular/forms';
import { AdminPublicationCardComponent } from './components/admin-publication-card/admin-publication-card.component';

@Component({
  selector: 'app-listings',
  imports: [CommonModule,NgIcon,FormsModule,AdminPublicationCardComponent],
    providers: [
      provideIcons({ 
      heroFunnelMicro,
      })
    ],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit{
  private readonly publicationService = inject(PublicationService);
  private readonly categoryService = inject(CategoryService);
  publications = signal<Publication[]>([])
  publication = model.required<Publication>();
  categories = signal<Category[]>([])

  private router = inject(Router)

  ngOnInit(): void {
    this.loadPublications("1")
    this.loadCategories()
  }

  private loadPublications(userId: string): void {

    this.publicationService.getAll().subscribe({
      next: (data) => {

        const userPublications = data.filter(
          publication => publication.userId === userId 
          && publication.price > 0
        );

        this.publications.set(userPublications);
      },

      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

  loadCategories(){
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },

      error: (err) => {
        console.error('Error al cargar categoria:', err);
      }
    });
  }

   // Filtros
  readonly search = signal('');

  readonly selectedCategory = signal('Todo');

  readonly condition = signal<string | null>(null);

  readonly maxPrice = signal(195000);

  readonly sortBy = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  readonly minPriceLimit = 10000;
  readonly maxPriceLimit = 195000;

  readonly conditions = [
    'Como nuevo',
    'Muy Bueno',
    'A Estrenar'
  ];

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

   toggleStatus() {
    this.publication.update(pub => ({
      ...pub,
      active: !pub.active
    }));
  }

    activePublications = computed(() => 
    this.publications().filter(p => p.active).length
  );



  // 4. Filtrar las pausadas/inactivas
  inactivePublications = computed(() => 
    this.publications().filter(p => !p.active).length
  );
}
