import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBookmark,
  heroCheck,
  heroPlus,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { BoxService } from '../../core/services/box.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { PublicationResponse } from '../../core/models/dto/response/publication-response';
import { Box } from '../../core/models/box';

@Component({
  selector: 'app-box-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  providers: [
    provideIcons({
      heroXMark,
      heroBookmark,
      heroCheck,
      heroPlus
    })
  ],
  templateUrl: './box-modal.component.html',
  styleUrl: './box-modal.component.css'
})
export class BoxModalComponent {
  private readonly boxService = inject(BoxService);
  private readonly authService = inject(AuthService);

  open = input<boolean>(false);
  publication = input.required<PublicationResponse>();

  closed = output<void>();
  saved = output<Box>();

  boxes = signal<Box[]>([]);
  loading = signal(false);
  savingBoxId = signal<string | number | null>(null);
  errorMessage = signal<string | null>(null);
  feedbackMessage = signal<string | null>(null);

  // Crear nueva Box rápida desde el modal
  showCreateForm = signal(false);
  newBoxTitle = signal('');
  creatingBox = signal(false);

  previewCover = computed(() => {
    const pub = this.publication();
    return pub.coverImage || pub.item?.[0]?.images?.[0] || '';
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.errorMessage.set(null);
        this.feedbackMessage.set(null);
        this.showCreateForm.set(false);
        this.newBoxTitle.set('');
        this.loadUserBoxes();
      }
    });
  }

  loadUserBoxes(): void {
    const currentUserId = this.authService.currentUser()?.id;
    if (!currentUserId) {
      this.boxes.set([]);
      this.errorMessage.set('Iniciá sesión para ver y administrar tus Boxes.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.boxService.getAll().subscribe({
      next: (allBoxes) => {
        const userBoxes = allBoxes.filter(
          (box) => String(box.userId) === String(currentUserId)
        );
        this.boxes.set(userBoxes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar las boxes:', err);
        this.loading.set(false);
        this.errorMessage.set('No se pudieron cargar tus Boxes.');
      }
    });
  }

  isPublicationSaved(box: Box): boolean {
    const pubId = this.publication().id;
    if (!pubId || !box.publications?.length) return false;
    return box.publications.some((p) => String(p.id) === String(pubId));
  }

  getBoxThumbnails(box: Box): string[] {
    const thumbs = (box.publications ?? [])
      .map((p) => p.coverImage || p.item?.[0]?.images?.[0] || '')
      .filter((img): img is string => Boolean(img));

    return Array.from(new Set(thumbs)).slice(0, 4);
  }

  saveToBox(box: Box): void {
    const pub = this.publication();
    if (!box.id || this.savingBoxId()) return;

    if (this.isPublicationSaved(box)) {
      this.feedbackMessage.set(`Ya está guardada en "${box.title}".`);
      return;
    }

    this.savingBoxId.set(box.id);
    this.errorMessage.set(null);
    this.feedbackMessage.set(null);

    const updatedPublications = [...(box.publications ?? []), pub];

    this.boxService.patch(box.id, { publications: updatedPublications }).subscribe({
      next: (updatedBox) => {
        this.boxes.update((list) =>
          list.map((item) => (String(item.id) === String(box.id) ? updatedBox : item))
        );
        this.savingBoxId.set(null);
        this.feedbackMessage.set(`Guardado en "${box.title}".`);
        this.saved.emit(updatedBox);
      },
      error: (err) => {
        console.error('Error al guardar en la box:', err);
        this.savingBoxId.set(null);
        this.errorMessage.set(`No se pudo guardar en "${box.title}".`);
      }
    });
  }

  toggleCreateForm(): void {
    this.errorMessage.set(null);
    this.feedbackMessage.set(null);
    this.showCreateForm.update((v) => !v);
  }

  createBoxAndSave(): void {
    const title = this.newBoxTitle().trim();
    const currentUserId = this.authService.currentUser()?.id;
    const pub = this.publication();

    if (!title || !currentUserId || this.creatingBox()) return;

    this.creatingBox.set(true);
    this.errorMessage.set(null);
    this.feedbackMessage.set(null);

    const payload: Partial<Box> = {
      title,
      userId: String(currentUserId),
      createdAt: new Date().toISOString(),
      publications: [pub]
    };

    this.boxService.create(payload as Box).subscribe({
      next: (createdBox) => {
        this.boxes.update((list) => [...list, createdBox]);
        this.creatingBox.set(false);
        this.newBoxTitle.set('');
        this.showCreateForm.set(false);
        this.feedbackMessage.set(`Creada "${createdBox.title}" y publicación guardada.`);
        this.saved.emit(createdBox);
      },
      error: (err) => {
        console.error('Error al crear la box:', err);
        this.creatingBox.set(false);
        this.errorMessage.set('No se pudo crear la Box.');
      }
    });
  }

  onClose(): void {
    if (this.savingBoxId() || this.creatingBox()) return;
    this.closed.emit();
  }
}