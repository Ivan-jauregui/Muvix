import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publcation } from '../../models/dto/request/publication';

@Injectable({
  providedIn: 'root'
})
export class PublicationTestService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/publicationtest";

  save(payload: Publcation): Observable<Publcation> {
    return this.http.post<Publcation>(this.apiUrl, payload)
  }
}
