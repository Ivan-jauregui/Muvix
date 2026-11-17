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
  imports: [CommonModule, RouterLink, AssociatedPublicationCard,SellerCard],
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

  loadAllPublications(){
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.allPublications.set(data);
      },
      error: (err) => {
        console.error('Error al cargar todas las publicaciones: ', err);
      }
    });
  }

  loadUser(id: string){
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
    

    if (!current || !current.item || current.item.length === 0) {
      return [];
    }


    const currentItemIds = new Set(current.item.map(i => i.id).filter(Boolean));
    if (currentItemIds.size === 0) return [];


    return all.filter(pub => {

      if (pub.id === current.id) return false;


      if (pub.status !== 'ACTIVE') return false;

      // 3. Que comparta al menos un ítem con la publicación actual
      return pub.item?.some(item => item.id && currentItemIds.has(item.id));
    });
  });


  selectImage(img:string){
    this.selectedImage.set(img)
  }

  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }

}
