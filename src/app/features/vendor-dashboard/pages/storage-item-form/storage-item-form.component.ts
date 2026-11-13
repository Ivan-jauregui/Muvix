import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemCondition, ItemStatus, StorageItem } from '../../../../core/models/storage-item';
import { StorageService } from '../storage/service/storage.service';
import { CloudinaryService } from '../../../../core/services/cloudinary/cloudinary.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-storage-item-form',
  imports: [ReactiveFormsModule],
  templateUrl: './storage-item-form.component.html',
  styleUrl: './storage-item-form.component.css'
})
export class StorageItemFormComponent {
  private fb = inject(NonNullableFormBuilder);
  private storageService = inject(StorageService);
  private cloudinaryService = inject(CloudinaryService);

  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  conditions: { value: ItemCondition; label: string }[] = [
    { value: 'NEW', label: 'Nuevo' },
    { value: 'LIKE_NEW', label: 'Como nuevo' },
    { value: 'GOOD', label: 'Buen estado' },
    { value: 'FAIR', label: 'Estado regular' }
  ];

  statuses: { value: ItemStatus; label: string }[] = [
    { value: 'STORED', label: 'Guardado' },
    { value: 'LISTED', label: 'Publicado' },
    { value: 'SOLD', label: 'Vendido' }
  ];

  selectedImage = signal<{ file: File; preview: string } | null>(null);

  storageForm;

  constructor() {
    this.storageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      condition: ['NEW' as ItemCondition, [Validators.required]],
      images: ['']
    });
  }



  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.errorMessage.set('Seleccioná una imagen JPG, PNG o WEBP.');
      input.value = '';
      return;
    }

    this.errorMessage.set(null);

    const currentImage = this.selectedImage();

    if (currentImage) {
      URL.revokeObjectURL(currentImage.preview);
    }

    this.selectedImage.set({
      file,
      preview: URL.createObjectURL(file)
    });

    input.value = '';
  }

  removeImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const image = this.selectedImage();

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    this.selectedImage.set(null);
  }


onSubmit() {
  if (this.storageForm.invalid) {
    this.storageForm.markAllAsTouched();
    return;
  }

  this.isSaving.set(true);
  this.errorMessage.set(null);

  const image = this.selectedImage();

  const upload = image
    ? this.cloudinaryService.uploadImage(image.file)
    : of('');

  upload.pipe(
    switchMap(imageUrl => {
      const formValue = this.storageForm.getRawValue();

      const storageItem: StorageItem = {
        userId: '1',
        title: formValue.title,
        description: formValue.description,
        categoryId: formValue.categoryId,
        condition: formValue.condition,
        status: 'STORED',
        images: imageUrl ? [imageUrl] : [],
        createdAt: new Date().toISOString()
      };

      return this.storageService.save(storageItem);
    })
  ).subscribe({
    next: () => {
      this.isSaving.set(false);

      const currentImage = this.selectedImage();

      if (currentImage) {
        URL.revokeObjectURL(currentImage.preview);
      }

      this.selectedImage.set(null);

      this.storageForm.reset({
        title: '',
        description: '',
        categoryId: '',
        condition: 'NEW',
        images: ''
      });
    },
    error: error => {
      console.error('Error al guardar:', error);
      this.errorMessage.set('No se pudo guardar el artículo.');
      this.isSaving.set(false);
    }
  });
}
}
