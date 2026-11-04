import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { PublicationImageService } from '../../../../core/services/publication-image/publication-image.service';
import { Category } from '../../../../core/models/category';
import { Publication } from '../../../../core/models/publicacion';
import { PublicationImages } from '../../../../core/models/publication-images';


@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell.component.html'
})
export class SellComponent {

  private fb = inject(FormBuilder);
  private publicationService = inject(PublicationService);
  private categoryService = inject(CategoryService);
  private imagesService = inject(PublicationImageService);

  categories = signal<Category[]>([]);
  loading = signal(false);

  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(1)]],
    condition: ['', Validators.required],
    category: ['', Validators.required],
    type: ['product', Validators.required]
  });

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (error) => console.error('Error cargando categorías', error)
    });
  }
selectedImages = signal<{
  file: File;
  preview: string;
  esPrincipal: boolean;
}[]>([]);

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files) return;

  const files = Array.from(input.files).filter(file =>
    file.type.startsWith('image/')
  );

  const currentImages = this.selectedImages();

  const newImages = files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    esPrincipal: currentImages.length === 0
  }));

  this.selectedImages.update(images => [
    ...images,
    ...newImages.map((image, index) => ({
      ...image,
      esPrincipal: images.length === 0 && index === 0
    }))
  ]);

  input.value = '';
}

removeSelectedImage(index: number): void {
  const images = [...this.selectedImages()];

  URL.revokeObjectURL(images[index].preview);

  images.splice(index, 1);

  if (images.length > 0 && !images.some(image => image.esPrincipal)) {
    images[0].esPrincipal = true;
  }

  this.selectedImages.set(images);
}

setPrincipalImage(index: number): void {
  this.selectedImages.update(images =>
    images.map((image, i) => ({
      ...image,
      esPrincipal: i === index
    }))
  );
}

  onSubmit(): void {

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  if (this.selectedImages().length === 0) {
    alert('Seleccioná al menos una imagen');
    return;
  }

  this.loading.set(true);

  const formValue = this.productForm.getRawValue();

  const publication: Publication = {
    title: formValue.title!,
    description: formValue.description!,
    price: Number(formValue.price),
    condition: formValue.condition!,
    publicationId: 0,
    category: this.categories().find(
      category => String(category.id) === formValue.category
    )!,
    type: formValue.type!,
    createdAt: new Date()
  };

  this.publicationService.save(publication).subscribe({
    next: (createdPublication) => {

      console.log('Publicación creada:', createdPublication);

      console.log('Archivos seleccionados:', this.selectedImages());

      this.loading.set(false);

      this.productForm.reset({
        title: '',
        description: '',
        price: 0,
        condition: '',
        category: '',
        type: 'product'
      });

      this.selectedImages.update(images => {
        images.forEach(image => URL.revokeObjectURL(image.preview));
        return [];
      });

    },
    error: (error) => {
      console.error('Error creando publicación:', error);
      this.loading.set(false);
    }
  });
}
}