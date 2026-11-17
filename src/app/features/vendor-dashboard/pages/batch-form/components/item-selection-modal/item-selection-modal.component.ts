
import {
  Component,
  computed,
  input,
  output,
  signal,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageItem } from '../../../../../../core/models/storage-item';


@Component({
  selector: 'app-item-selection-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-selection-modal.component.html'
})
export class ItemSelectionModalComponent {

  items = input<StorageItem[]>([]);
  loading = input<boolean>(false);
  error = input<string>('');


  selectionConfirmed = output<string[]>();
  closed = output<void>();

  selectedItemIds = signal<string[]>([]);
  searchTerm = signal('');



  filteredItems = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();

    return this.items().filter(item =>
      String(item.title ?? '').toLowerCase().includes(search) ||
      item.id!.toLowerCase().includes(search)
    );
  });

 



  isSelected(item: StorageItem): boolean {
    return this.selectedItemIds().includes(item.id!);
  }

  toggleItem(item: StorageItem): void {
    const id = item.id;

    if (!id) return;

    this.selectedItemIds.update(ids =>
      ids.includes(id)
        ? ids.filter(itemId => itemId !== id)
        : [...ids, id]
    );
  }

  
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }


  confirmSelection(): void {
    this.selectionConfirmed.emit([...this.selectedItemIds()]);
    this.closed.emit();
  }

  // CERRAR SIN CONFIRMAR
  closeModal(): void {
    this.closed.emit();
  }

}
