import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private http = inject(HttpClient);

  private cloudName = 'vhycikpc';
  private uploadPreset = 'ml_default';

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post<CloudinaryResponse>(url, formData).pipe(
      map(response => response.secure_url)
    );
  }
}