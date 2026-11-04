import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PublicationImages } from '../../models/publication-images';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationImageService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/images";

  save(req: PublicationImages): Observable<PublicationImages> {
      return this.http.post<PublicationImages>(this.apiUrl, req)
  }
}
