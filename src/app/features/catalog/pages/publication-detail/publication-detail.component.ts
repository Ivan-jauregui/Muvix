import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { UserService } from '../../../profile/pages/service/user.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { BoxService } from '../../../../core/services/box.service';
import { AssociatedPublicationCard } from '../../components/associated-publication-card/associated-publication-card.component';
import { SellerCard } from '../../components/seller-card/seller-card.component';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { Box } from '../../../../core/models/box';
import { User } from '../../../../core/models/user';
import { BoxModalComponent } from '../../components/box-modal/box-modal.component';

@Component({
  selector: 'app-publication-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AssociatedPublicationCard,
    SellerCard,
    NgIcon,
    BoxModalComponent
],
  providers: [
    provideIcons({ heroPencil })
  ],
  templateUrl: './publication-detail.component.html',
  styleUrl: './publication-detail.component.css'
})
export class PublicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private publicationService = inject(PublicationService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private boxService = inject(BoxService);

  currentUser = this.authService.currentUser;

  publication = signal<PublicationResponse | null>(null);
  allPublications = signal<PublicationResponse[]>([]);
  selectedImage = signal<string | null>(null);
  selectedIndex = signal(0);

  user = signal<User | null>(null);

  isBoxModalOpen = signal(false);
  myBoxes = signal<Box[]>([]);
  loadingBoxes = signal(false);
  savingToBoxId = signal<string | number | null>(null);
  boxFeedbackMessage = signal<string | null>(null);

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

  openBoxesModal(): void {
    this.isBoxModalOpen.set(true);
  }

  closeBoxesModal(): void {
    this.isBoxModalOpen.set(false);
  }

  onBoxSaved(updatedBox: Box): void {
    console.log('Publicación guardada en:', updatedBox.title);
  }

  private loadCurrentUserBoxes(currentUserId: string): void {
    this.loadingBoxes.set(true);

    this.boxService.getAll().subscribe({
      next: (boxes) => {
        const userBoxes = boxes.filter(box => String(box.userId) === currentUserId);
        this.myBoxes.set(userBoxes);
        this.loadingBoxes.set(false);
      },
      error: (err) => {
        console.error('Error al cargar las boxes del usuario:', err);
        this.myBoxes.set([]);
        this.loadingBoxes.set(false);
      }
    });
  }

  isPublicationInBox(box: Box): boolean {
    const pubId = this.publication()?.id;
    if (!pubId || !box.publications?.length) return false;
    return box.publications.some(p => p.id === pubId);
  }

  savePublicationToBox(box: Box): void {
    const pub = this.publication();
    if (!pub || !box.id) return;

    if (this.isPublicationInBox(box)) {
      this.boxFeedbackMessage.set(`Ya está guardada en "${box.title}".`);
      return;
    }

    this.savingToBoxId.set(box.id);
    this.boxFeedbackMessage.set(null);

    const updatedPublications = [...(box.publications || []), pub as any];

    this.boxService.patch(box.id, { publications: updatedPublications }).subscribe({
      next: (updatedBox) => {
        this.myBoxes.update(list =>
          list.map(item => (item.id === box.id ? updatedBox : item))
        );
        this.savingToBoxId.set(null);
        this.boxFeedbackMessage.set(`Guardado en "${box.title}".`);
      },
      error: (err) => {
        console.error('Error al guardar publicación en la box:', err);
        this.savingToBoxId.set(null);
        this.boxFeedbackMessage.set('No se pudo guardar en la box.');
      }
    });
  }

  loadPublication(id: string): void {
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

  loadAllPublications(): void {
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.allPublications.set(data);
      },
      error: (err) => {
        console.error('Error al cargar todas las publicaciones: ', err);
      }
    });
  }

  loadUser(id: string): void {
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        console.log('Error al cargar el usuario: ' + err);
      }
    });
  }

  isOwnPublication = computed(() => {
    const currentUserId = this.authService.currentUser()?.id;
    const ownerId = this.publication()?.userId;

    if (!currentUserId || !ownerId) return false;

    return String(currentUserId) === String(ownerId);
  });

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

  selectImage(img: string): void {
    this.selectedImage.set(img);
  }

  viewDetails(id: string): void {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }

  images = computed(() => {
    const p = this.publication();
    if (!p) return [];
    const extra = (p.item ?? []).map(i => i.images?.[0]).filter(Boolean);
    return Array.from(new Set([p.coverImage, ...extra].filter((u): u is string => Boolean(u))));
  });

  currentImage = computed(() => this.images()[this.selectedIndex()]);

  nextImage(): void {
    if (!this.images().length) return;
    this.selectedIndex.update(i => (i + 1) % this.images().length);
  }

  prevImage(): void {
    if (!this.images().length) return;
    this.selectedIndex.update(i => (i - 1 + this.images().length) % this.images().length);
  }

  private conditionMap: Record<string, { label: string; css: string }> = {
    'Nuevo': { label: 'Nuevo', css: 'text-emerald-600' },
    'Como nuevo': { label: 'Como nuevo', css: 'text-green-600' },
    'Buen estado': { label: 'Buen estado', css: 'text-amber-600' },
    'Regular': { label: 'Regular', css: 'text-gray-500' }
  };

  conditionLabel = computed(() => {
    const rawCondition = this.publication()?.item?.[0]?.condition;
    if (!rawCondition) {
      return this.conditionMap['Nuevo'].label;
    }
    return this.conditionMap[rawCondition]?.label ?? rawCondition;
  });

  conditionClass = computed(() => {
    const condition = this.publication()?.item?.[0]?.condition ?? 'Nuevo';
    return this.conditionMap[condition]?.css ?? 'text-emerald-600';
  });
}