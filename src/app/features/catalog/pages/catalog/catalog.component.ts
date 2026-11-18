import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PublicationImages } from '../../../../core/models/publication-images';
import { PublicationFilterComponent } from '../../components/publication-filter/publication-filter.component';
import { ItemCondition, StorageItem } from '../../../../core/models/storage-item';
import { StorageService } from '../../../vendor-dashboard/pages/storage/service/storage.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { Category } from '../../../../core/models/category';
import { CategoryService } from '../../../../core/services/category/category.service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroHeart,
  heroChatBubbleLeftRight,
  heroAdjustmentsHorizontal  } from '@ng-icons/heroicons/outline';


@Component({
  selector: 'app-catalog',
  imports: [CommonModule,NgIcon,  RouterLink, PublicationFilterComponent],
    providers: [
      provideIcons({
        heroHeart,
        heroChatBubbleLeftRight,
        heroAdjustmentsHorizontal
      })
    ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private router = inject(Router)
  private publicationService = inject(PublicationService);
  private categoryService = inject(CategoryService) 

  readonly showFilters = signal(false);
  publications = signal<PublicationResponse[]>([]);
  categories = signal<Category[]>([]);


  ngOnInit(): void {
    this.loadPublications();
    this.loadCategories();
  }


  private loadPublications(): void {
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.publications.set(data);

        console.log(this.publications())
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones:', err);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('Error al obtener las categorias:', error);
      }
    });
  }




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


toggleFilters(): void {
  this.showFilters.update(v => !v);
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

  viewDetails(id: string): void {
    this.router.navigate(['/catalog', id]);
  }
}
