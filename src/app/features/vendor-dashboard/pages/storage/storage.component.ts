import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from './service/storage.service';
import { StorageItem } from '../../../../core/models/storage-item';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroArrowUpRight,
  heroTrash
} from '@ng-icons/heroicons/outline'

@Component({
  selector: 'app-storage',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      heroPlus,
      heroArrowUpRight,
      heroTrash
    })
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
  private readonly storageService = inject(StorageService);
  public storageItem = signal<StorageItem[]>([]);
  itemToDelete = signal<StorageItem | null>(null);
  isDeleting = signal(false);

  ngOnInit(): void {
    this.loadStorageItems();
  }

  
  openDeleteModal(item: StorageItem): void {
    this.itemToDelete.set(item);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) return;
    this.itemToDelete.set(null);
  }

 


  private loadStorageItems(): void {
    this.storageService.getItemsByUserId().subscribe({
      next: (data) => {
        this.storageItem.set(data);
      },
      error: (err) => {
        console.error('Error al cargar las items:', err);
      }
    });
  }

confirmDelete(): void {
    const target = this.itemToDelete();
    if (!target?.id || this.isDeleting()) return;

    this.isDeleting.set(true);

    this.storageService.delete(target.id).subscribe({
      next: () => {
        this.storageItem.update((items) =>
          items.filter((i) => String(i.id) !== String(target.id))
        );
        this.isDeleting.set(false);
        this.itemToDelete.set(null);
      },
      error: (err) => {
        console.error('Error al eliminar el item:', err);
        this.isDeleting.set(false);
      }
    });
  }
}
