
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { StorageService } from '../storage/service/storage.service';
import { StorageItem } from '../../../../core/models/storage-item';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ItemSelectionModalComponent } from './components/item-selection-modal/item-selection-modal.component';

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
  selector: 'app-batch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ItemSelectionModalComponent ],
  templateUrl: './batch-form.component.html',
  styleUrl: './batch-form.component.css'
})
export class BatchFormComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private publicationService = inject(PublicationService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);


  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [1, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });

  selectedItemIds = signal<string[]>([]);
  modalOpen = signal(false);
  loadingItems = signal(false);
  itemsLoaded = signal(false);
  itemsError = signal('');

  items = signal<StorageItem[]>([]);

  selectedItems = computed(() => {
    const ids = this.selectedItemIds();

    return this.items().filter(item =>
      ids.includes(this.getItemId(item))
    );
  });

  onItemsSelected(ids: string[]): void {
    this.selectedItemIds.set(ids);

    console.log('IDs recibidos:', ids);
  } 

  openItemsModal(): void {
    this.modalOpen.set(true);

    if (!this.itemsLoaded() && !this.loadingItems()) {
      this.loadItems();
    }
  }

  closeItemsModal(): void {
    this.modalOpen.set(false);
  }

  loadItems(): void {
    this.loadingItems.set(true);
    this.itemsError.set('');

    this.storageService.getItemsByUserId().subscribe({
      next: (data: StorageItem[]) => {
        this.items.set(data);
        console.log(this.items)
        this.itemsLoaded.set(true);
        this.loadingItems.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los ítems:', err);
        this.itemsError.set('No se pudieron cargar los ítems del inventario.');
        this.loadingItems.set(false);
      }
    });
  }

  getItemId(item: StorageItem): string {
    return String(item.id ?? '');
  }

  getItemLabel(item: StorageItem): string {
    const data = item as StorageItem & {
      title?: string;
      name?: string;
      description?: string;
    };

    return data.title || data.name || data.description || 'Ítem sin nombre';
  }

  removeItem(id: string): void {
    this.selectedItemIds.update(ids =>
      ids.filter(itemId => itemId !== id)
    );
  }

  onSubmit(): void {

    this.form.markAllAsTouched();

    if (this.form.invalid || this.selectedItemIds().length === 0) {
      return;
    }

    const formValue = this.form.getRawValue();

    const publication: PublicationRequest = {
      userId: this.authService.currentUser()?.id,
      title: formValue.title,
      description: formValue.description,
      price: Number(formValue.price),
      type: 'BATCH',
      status: 'ACTIVE',
      category: formValue.category,
      itemIds: this.selectedItemIds(),
      createdAt: new Date().toISOString()
    };

    this.publicationService.save(publication).subscribe({
      next: (data) => {
        console.log('Publicación creada:', data);
        this.router.navigate(['/dashboard/listings']);
      },
      error: (err) => {
        console.error('Error al crear la publicación:', err);
      }
    });
  }
}
