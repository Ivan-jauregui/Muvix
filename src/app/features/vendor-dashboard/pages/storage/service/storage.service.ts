import { inject, Injectable } from '@angular/core';
import { StorageItem } from '../../../../../core/models/storage-item';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private http = inject(HttpClient);
  private apiUrl="http://localhost:3000/storage";

  save(payload:StorageItem):Observable<StorageItem>{
    return  this.http.post<StorageItem>(this.apiUrl,payload);
  }

  getAll():Observable<StorageItem[]>{
    return  this.http.get<StorageItem[]>(this.apiUrl);
  }
}
