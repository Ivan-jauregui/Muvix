import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { Publication } from '../../models/publicacion';
import { map, switchMap } from 'rxjs/operators';
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
      switchMap(publications =>
        forkJoin(publications.map(pub => this.mapPublication(pub)))
      )
    );
  }

  getById(id: string): Observable<PublicationResponse> {
    return this.http.get<Publication>(`${this.apiUrl}/${id}`).pipe(
      switchMap(publication => this.mapPublication(publication))
    );
  }

  getPublicationsByUser(userId: string): Observable<Publication[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Publication[]>(this.apiUrl, { params });
  }

  getPublicationsByUserId(): Observable<PublicationResponse[]> {
    return this.getAll().pipe(
      map((data: PublicationResponse[]) => data.filter(p => p.userId === this.authService.currentUser()?.id))
    );
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
}
