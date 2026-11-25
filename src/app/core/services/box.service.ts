import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Box } from '../models/box';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/boxes';

  getAll(): Observable<Box[]> {
    return this.http.get<Box[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number | string): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  create(box: Box): Observable<Box> {
    return this.http.post<Box>(this.apiUrl, box).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number | string, box: Box): Observable<Box> {
    return this.http.put<Box>(`${this.apiUrl}/${id}`, box).pipe(
      catchError(this.handleError)
    );
  }

  patch(id: number | string, changes: Partial<Box>): Observable<Box> {
    return this.http.patch<Box>(`${this.apiUrl}/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }


  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

getPublicationsByUserId(userId: string): Observable<Box[]> {
  return this.http.get<Box[]>(this.apiUrl).pipe(
    map((boxes) =>
      boxes
        .filter((box) => String(box.userId) === String(userId))
        .map((box) => ({
          ...box,
          publications: (box.publications ?? []).filter(
            (pub) => pub.status === 'ACTIVE' || pub.status === 'RESERVED'
          ),
        }))
    )
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error instanceof ErrorEvent
      ? `Error del cliente: ${error.error.message}`
      : `Error del servidor (${error.status}): ${error.message}`;
    console.error(message);
    return throwError(() => new Error('No se pudo completar la operación con Box.'));
  }
}
