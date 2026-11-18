import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { AssociatedPublicationCard } from '../../components/associated-publication-card/associated-publication-card.component';
import { User } from '../../../../core/models/user';
import { UserService } from '../../../profile/pages/service/user.service';
import { SellerCard } from '../../components/seller-card/seller-card.component';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';


@Component({
  selector: 'app-publication-detail',
  imports: [CommonModule, RouterLink, AssociatedPublicationCard, SellerCard],
  templateUrl: './publication-detail.component.html',
  styleUrl: './publication-detail.component.css'
})
export class PublicationDetailComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private publicationService = inject(PublicationService);
  private userService = inject(UserService);

  publication = signal<PublicationResponse | null>(null);
  allPublications = signal<PublicationResponse[]>([]);
  selectedImage = signal<string | null>(null);

  user = signal<User | null>(null);

  ngOnInit(): void {

    this.loadAllPublications();


    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.selectedImage.set(null);
        this.loadPublication(idParam);
      }
    });
  }

  loadPublication(id: string) {
    this.publicationService.getById(id).subscribe({
      next: (data) => {
        this.publication.set(data);
        if (data?.userId) {
          this.loadUser(data.userId);
        }
      },
      error: (err) => {
        console.error('Error al cargar la publicación: ', err);
        this.publication.set(null);
      }
    });
  }

  loadAllPublications() {
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.allPublications.set(data);
      },
      error: (err) => {
        console.error('Error al cargar todas las publicaciones: ', err);
      }
    });
  }

  loadUser(id: string) {
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        console.log("Error al cargar el usuario: " + err);
      }
    });
  }

  readonly associatedPublications = computed(() => {
    const current = this.publication();
    const all = this.allPublications();

    if (!current || !current.item?.length) {
      return [];
    }

    const currentItemIds = new Set(
      current.item.map(item => item.id).filter(Boolean)
    );

    if (currentItemIds.size === 0) return [];

    return all.filter(pub => {
      if (pub.id === current.id) return false;

      if (pub.status !== 'ACTIVE') return false;

      if (pub.type === 'BATCH') return false;

      return pub.item?.some(item =>
        item.id && currentItemIds.has(item.id)
      );
    });
  });


  selectImage(img: string) {
    this.selectedImage.set(img)
  }

  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }
selectedIndex = signal(0);

// Portada primero, después el resto de imágenes sin duplicar
images = computed(() => {
  const p = this.publication();
  if (!p) return [];
  const extra = (p.item ?? []).map(i => i.images[0]); // ← ajustá al campo real de StorageItem
  return [p.coverImage, ...extra.filter(u => u !== p.coverImage)].filter(Boolean);
});

currentImage = computed(() => this.images()[this.selectedIndex()]);

nextImage() {
  this.selectedIndex.update(i => (i + 1) % this.images().length);
}

prevImage() {
  this.selectedIndex.update(i => (i - 1 + this.images().length) % this.images().length);
}

private conditionMap = {
  'Nuevo': { label: 'Nuevo', css: 'text-emerald-600' },
  'Como nuevo': { label: 'Como nuevo', css: 'text-green-600' },
  'Buen estado': { label: 'Buen estado', css: 'text-amber-600' },
  'Regular': { label: 'Regular', css: 'text-gray-500' }
};

conditionLabel = computed(() => {
  const condition = this.publication()?.item?.[0]?.condition ?? 'Nuevo';
  return this.conditionMap[condition].label;
});

conditionClass = computed(() => {
  const condition = this.publication()?.item?.[0]?.condition ?? 'Nuevo';
  return this.conditionMap[condition].css;
});

}
