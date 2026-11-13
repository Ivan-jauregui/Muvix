import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from './service/storage.service';
import { StorageItem } from '../../../../core/models/storage-item';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroArrowUpRight
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-storage',
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      heroPlus,
      heroArrowUpRight
    })
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
  private readonly storageService = inject(StorageService);
  public storageItem = signal<StorageItem[]>([]);

 
 ngOnInit(): void {
    this.loadStorageItems();
  }

  private loadStorageItems(): void {
    this.storageService.getAll().subscribe({
      next: (data) => {
        this.storageItem.set(data);
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones:', err);
      }
    });
  }


}
