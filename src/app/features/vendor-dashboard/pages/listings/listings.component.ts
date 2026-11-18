import { Component, OnInit, computed, inject, model, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { Router } from '@angular/router';
import { heroFunnelMicro } from '@ng-icons/heroicons/micro';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { AdminPublicationCardComponent } from './components/admin-publication-card/admin-publication-card.component';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-listings',
  imports: [CommonModule, NgIcon, FormsModule, AdminPublicationCardComponent],
  providers: [
    provideIcons({
      heroFunnelMicro,
    })
  ],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit {
  private readonly publicationService = inject(PublicationService);
  private authService = inject(AuthService)
  private router = inject(Router)

  publications = signal<PublicationResponse[]>([])  
  viewMode = signal<'grid' | 'list'>('grid');
  sectionOpen = signal(true);

  ngOnInit(): void {
    //Futura implementacion con guard para que no entre a dashboard sin haberse autenticado
    const user = this.authService.currentUser();
    if (!user) return;

    this.loadPublications(user.id!);
  }

  private loadPublications(userId: string): void {

    this.publicationService.getMyPublications().subscribe({
      next: (data) => {
        this.publications.set(data);
      },

      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }



  readonly search = signal('');

  readonly selectedCategory = signal('Todo');

  readonly statusFilter = signal<'ACTIVE' | 'PAUSED' | 'RESERVED'>('ACTIVE');

  readonly condition = signal<string | null>(null);

  readonly maxPrice = signal(195000);

  readonly sortBy = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  readonly categories = computed(() => [
    'Todo',
    ...new Set(this.publications().map(p => p.category).filter(Boolean))
  ]);


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
    const category = this.selectedCategory();
    const condition = this.condition();
    const maxPrice = this.maxPrice();
    const status = this.statusFilter();

    const list = this.publications().filter(publication => {

      const matchesSearch =
        !query ||
        publication.title.toLowerCase().includes(query) ||
        publication.description.toLowerCase().includes(query);

      const matchesCategory =
        category === 'Todo' ||
        publication.category === category;

      const matchesCondition =
        !condition ||
        publication.item?.some(item => item.condition === condition);

      const matchesPrice = publication.price <= maxPrice;

      const matchesStatus = publication.status === status;

      return matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        matchesPrice &&
        matchesStatus;
    });

    return [...list].sort((a, b) => {
      if (this.sortBy() === 'priceAsc') {
        return a.price - b.price;
      }

      if (this.sortBy() === 'priceDesc') {
        return b.price - a.price;
      }

      return new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();
    });
  });

  readonly totalCount = computed(() => this.publications().length);

  activePublications = computed(() =>
    this.publications().filter(p => p.status === 'ACTIVE')
  );

  reservedPublications = computed(() =>
    this.publications().filter(p => p.status === 'RESERVED')
  );

  inactivePublications = computed(() =>
    this.publications().filter(p => p.status === 'PAUSED')
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
        publication.category === category
    ).length;
  }

  conditionCount(condition: string): number {
    return this.publications().filter(publication =>
      publication.item?.some(storageItem => storageItem.condition === condition)
    ).length;
  }



  clearFilters(): void {

    this.search.set('');
    this.selectedCategory.set('Todo');
    this.condition.set(null);
    this.maxPrice.set(this.maxPriceLimit);
    this.sortBy.set('newest');
    this.statusFilter.set('ACTIVE');
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

  setStatusFilter(status: 'ACTIVE' | 'PAUSED' | 'RESERVED') {
    this.statusFilter.set(status);
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

  toggleStatus(updatedPublication: PublicationResponse) {
    this.publicationService.update(updatedPublication, updatedPublication.id).subscribe({
      next: (updated) => {
        this.publications.update(pubs =>
          pubs.map(pub =>
            pub.id === updated.id
              ? { ...pub, status: updated.status }
              : pub
          )
        );
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
      }
    });
  }

}
