
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StorageService } from '../storage/service/storage.service';
import { StorageItem } from '../../../../core/models/storage-item';
import { PublicationService } from '../../../../core/services/publication/publication-service';

export interface PublicationRequest {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  price: number;
  type: 'INDIVIDUAL' | 'BATCH';
  status: 'ACTIVE' | 'PAUSED' | 'RESERVERD' | 'SOLD';
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

  private router = inject(Router)
  private route = inject(ActivatedRoute);
  private publicationService = inject(PublicationService)
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);

  storageItem = signal<StorageItem | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });
  

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadStorageItem(id);
    }
  }

  loadStorageItem(id: string): void {
    this.storageService.getById(id).subscribe({
      next: (item) => {
        this.storageItem.set(item);

        this.form.patchValue({
          title: item.title,
          description: item.description,
          category: item.categoryId
        });
      },
      error: (error) => {
        console.error('Error al obtener el artículo:', error);
      }
    });
  }

  onSubmit(): void {
    const item = this.storageItem();

    if (!item || !item.id || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

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
        console.log("publicacion creada: " + data.price)
        this.router.navigate(["/dashboard/sell"])
      },
      error: (err) => {
        console.error('Error al cargar las items:', err);
      }
    });
  }
}
