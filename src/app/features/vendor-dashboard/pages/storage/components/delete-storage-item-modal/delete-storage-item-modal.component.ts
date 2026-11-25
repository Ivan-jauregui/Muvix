import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { StorageItem } from '../../../../../../core/models/storage-item';
import { PublicationResponse } from '../../../../../../core/models/dto/response/publication-response';
;

@Component({
  selector: 'app-delete-storage-item-modal',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({ heroExclamationTriangle })
  ],
  templateUrl: './delete-storage-item-modal.component.html',
  styleUrl: './delete-storage-item-modal.component.css'
})
export class DeleteStorageItemModalComponent {
  item = input<StorageItem | null>(null);
  publications = input<PublicationResponse[]>([]);
  isDeleting = input<boolean>(false);

  closed = output<void>();
  confirmed = output<StorageItem>();

  linkedPublications = computed(() => {
    const target = this.item();
    if (!target?.id) return [];

    return this.publications().filter((pub) =>
      (pub.item ?? []).some((i) => String(i.id) === String(target.id))
    );
  });

  isInBatch = computed(() =>
    this.linkedPublications().some((pub) => pub.type === 'BATCH')
  );

  cannotDelete = computed(() => this.linkedPublications().length > 0);

  onClose(): void {
    if (this.isDeleting()) return;
    this.closed.emit();
  }

  onConfirm(): void {
    const target = this.item();
    if (!target?.id || this.isDeleting() || this.cannotDelete()) return;
    this.confirmed.emit(target);
  }
}