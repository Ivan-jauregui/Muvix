import { inject, Injectable } from '@angular/core';
import { StorageItem } from '../../../../../core/models/storage-item';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/storage";

  private authService = inject(AuthService)

  save(payload: StorageItem): Observable<StorageItem> {
    return this.http.post<StorageItem>(this.apiUrl, payload);
  }

  getAll(): Observable<StorageItem[]> {
    return this.http.get<StorageItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<StorageItem> {
    return this.http.get<StorageItem>(`${this.apiUrl}/${id}`);
  }

  getItemsByUserId(): Observable<StorageItem[]> {
    return this.getAll().pipe(
      map((data: StorageItem[]) => data.filter(item => item.userId === this.authService.currentUser()?.id))
    );
  }
}
