import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/categories";

  save(payload: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, payload)
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
  
}
