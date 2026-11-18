
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StorageService } from '../storage/service/storage.service';
import { StorageItem } from '../../../../core/models/storage-item';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Category } from '../../../../core/models/category';

export interface PublicationRequest {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  price: number;
  type: 'INDIVIDUAL' | 'BATCH';
  status: 'ACTIVE' | 'PAUSED' | 'RESERVED' | 'SOLD';
  category: string;
  itemIds: string[];
  createdAt: string;
}

@Component({
  selector: 'app-sell-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell-form.component.html'
})
export class SellFormComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private publicationService = inject(PublicationService);
  private storageService = inject(StorageService);
  private categoryService = inject(CategoryService) 
  private fb = inject(FormBuilder);

  storageItem = signal<StorageItem | null>(null);
  publication = signal<PublicationResponse | null>(null);
  categories = signal<Category[]>([]);

  isEditing = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadCategories()

    const itemId = this.route.snapshot.paramMap.get('id');
    const publicationId = this.route.snapshot.paramMap.get('publicationId');

    if (publicationId) {
      this.isEditing.set(true);
      this.loadPublication(publicationId);
      return;
    }

    if (itemId) {
      this.loadStorageItem(itemId);
    }
  }

  loadStorageItem(id: string){
    this.storageService.getById(id).subscribe({
      next: (item) => {
        this.storageItem.set(item);

        this.form.patchValue({
          title: item.title,
          description: item.description,
        });
      },
      error: (error) => {
        console.error('Error al obtener el artículo:', error);
      }
    });
  }

  loadPublication(id: string){
    this.publicationService.getById(id).subscribe({
      next: (publication) => {
        this.publication.set(publication);

        this.form.patchValue({
          title: publication.title,
          description: publication.description,
          price: publication.price,
          category: publication.category
        });
      },
      error: (error) => {
        console.error('Error al obtener la publicación:', error);
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


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.isEditing()) {
      const currentPublication = this.publication();

      if (!currentPublication?.id) return;

      const updatedPublication: PublicationResponse = {
        ...currentPublication,
        title: formValue.title!,
        description: formValue.description!,
        price: Number(formValue.price),
        category: formValue.category!
      };

      this.publicationService.update(updatedPublication,updatedPublication.id ).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/listings']);
        },
        error: (err) => {
          console.error('Error al actualizar la publicación:', err);
        }
      });

      return;
    }

    const item = this.storageItem();

    if (!item?.id) return;

    const publication: PublicationRequest = {
      userId: item.userId,
      title: formValue.title!,
      description: formValue.description!,
      price: Number(formValue.price),
      type: 'INDIVIDUAL',
      status: 'ACTIVE',
      category: formValue.category!,
      itemIds: [item.id],
      createdAt: new Date().toISOString()
    };

    this.publicationService.save(publication).subscribe({
      next: (data) => {
        console.log('Publicación creada:', data.price);
        this.router.navigate(['/dashboard/listings']);
      },
      error: (err) => {
        console.error('Error al crear la publicación:', err);
      }
    });
  }
}
