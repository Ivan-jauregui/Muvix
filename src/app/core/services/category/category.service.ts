import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/categories";

  
    getAll(): Observable<Category[]> {
      return this.http.get<Category[]>(this.apiUrl)
    }
}
