import { Component, signal } from '@angular/core';
import { PublicationImages } from '../../../../../../core/models/publication-images';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publication-images',
  imports: [CommonModule],
  templateUrl: './publication-images.component.html',
  styleUrl: './publication-images.component.css'
})
export class PublicationImagesComponent {
  images = signal<PublicationImages[]>([]);
  filesToUpload = signal<File[]>([]);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const files = Array.from(input.files);

    files.forEach(file => {
      const objectUrl = URL.createObjectURL(file);

      this.images.update(prev => [
        ...prev,
        {
          id: Math.max(0, ...prev.map(img => img.id)) + 1,
          url_images: objectUrl,
          esPrincipal: prev.length === 0,
          publicationId: 0
        }
      ]);

      this.filesToUpload.update(prev => [...prev, file]);
    });

    input.value = '';
  }

  removeImage(imageId: number): void {
    const index = this.images().findIndex(
      img => img.id === imageId
    );

    if (index === -1) return;

    const image = this.images()[index];

    URL.revokeObjectURL(image.url_images);

    this.images.update(prev =>
      prev.filter(img => img.id !== imageId)
    );

    this.filesToUpload.update(prev =>
      prev.filter((_, i) => i !== index)
    );

    if (image.esPrincipal && this.images().length > 0) {
      this.makePrincipal(this.images()[0].id);
    }
  }

  makePrincipal(imageId: number): void {
    this.images.update(prev =>
      prev.map(image => ({
        ...image,
        esPrincipal: image.id === imageId
      }))
    );
  }

  clearImages(): void {
    this.images().forEach(image => {
      URL.revokeObjectURL(image.url_images);
    });

    this.images.set([]);
    this.filesToUpload.set([]);
  }
}
