import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { Publication } from '../../models/publicacion';
import { filter, map, switchMap } from 'rxjs/operators';
import { PublicationResponse } from '../../models/dto/response/publication-response';
import { StorageService } from '../../../features/vendor-dashboard/pages/storage/service/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/publications";

  private authService = inject(AuthService)
  private storageService = inject(StorageService);

  save(req: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.apiUrl, req)
  }

  getAll(): Observable<PublicationResponse[]> {
    return this.http.get<Publication[]>(this.apiUrl).pipe(
      map(publications => {
        const currentUserId = this.authService.currentUser()?.id;
        return publications.filter(p => p.userId !== currentUserId);
      }),
      switchMap(publications => {
        if (publications.length === 0) {
          return of([]);
        }
        return forkJoin(publications.map(pub => this.mapPublication(pub)));
      })
    );
  }

  // Mis publicaciones
  getMyPublications(): Observable<PublicationResponse[]> {
    const currentUserId = this.authService.currentUser()?.id;

    if (!currentUserId) {
      return of([]);
    }

    return this.getPublicationsByUserId(currentUserId);
  }

  // Publicaciones de cualquier usuario
  getPublicationsByUserId(userId: string): Observable<PublicationResponse[]> {
    return this.http.get<Publication[]>(this.apiUrl).pipe(
      map(publications => publications.filter(p => p.userId === userId)),
      switchMap(publications =>
        publications.length === 0
          ? of([])
          : forkJoin(publications.map(pub => this.mapPublication(pub)))
      )
    );
  }


  getById(id: string): Observable<PublicationResponse> {
    return this.http.get<Publication>(`${this.apiUrl}/${id}`).pipe(
      switchMap(publication => this.mapPublication(publication))
    );
  }

  update(response: PublicationResponse, id: string) {
    const publication = this.mapResponseToPublication(response);

    return this.http.put<Publication>(
      `${this.apiUrl}/${id}`,
      publication
    );
  }

  updateStatus(id: string, status: PublicationResponse['status']) {
    return this.http.patch<Publication>(`${this.apiUrl}/${id}`, { status });
  }

  getPublicationsByUser(userId: string): Observable<Publication[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Publication[]>(this.apiUrl, { params });
  }





  private mapPublication(pub: Publication): Observable<PublicationResponse> {
    const { itemIds, ...publication } = pub;

    return (
      itemIds.length
        ? forkJoin(itemIds.map(id => this.storageService.getById(id)))
        : of([])
    ).pipe(
      map(items => ({
        ...publication,
        id: pub.id!,
        userId: pub.userId!,
        item: items,
        coverImage: items[0]?.images?.[0] ?? ''
      }))
    );
  }

  private mapResponseToPublication(
    response: PublicationResponse
  ): Publication {
    return {
      id: response.id,
      userId: response.userId,
      title: response.title,
      description: response.description,
      price: response.price,
      type: response.type,
      status: response.status,
      category: response.category,
      itemIds: response.item.flatMap(item =>
        item.id ? [item.id] : []
      ),
      createdAt: response.createdAt
    };
  }
}
