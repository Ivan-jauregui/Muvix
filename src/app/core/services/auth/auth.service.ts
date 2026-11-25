import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  currentUser = signal<User | null>(null);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  register(req: User): Observable<User> {
    const cleanEmail = req.email.trim().toLowerCase();
    const cleanPhone = this.normalizePhone(req.phoneNumber);

    return this.getAll().pipe(
      switchMap(users => {
        const emailExists = users.some(
          user => user.email?.trim().toLowerCase() === cleanEmail
        );
        const phoneExists = users.some(
          user => this.normalizePhone(user.phoneNumber ?? '') === cleanPhone
        );

        if (emailExists && phoneExists) {
          return throwError(() => ({
            status: 409,
            message: 'Ya existe un usuario registrado con ese email y teléfono.'
          }));
        }

        if (emailExists) {
          return throwError(() => ({
            status: 409,
            message: 'Ya existe un usuario registrado con ese email.'
          }));
        }

        if (phoneExists) {
          return throwError(() => ({
            status: 409,
            message: 'Ya existe un usuario registrado con ese phone.'
          }));
        }

        return this.http.post<User>(this.apiUrl, {
          ...req,
          email: cleanEmail,
          phoneNumber: cleanPhone
        });
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    return this.getAll().pipe(
      map(users =>
        users.find(user =>
          user.email?.trim().toLowerCase() === cleanEmail &&
          user.password === cleanPassword
        ) ?? null
      ),
      tap(user => this.currentUser.set(user)),
      map(user => user !== null)
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return of(false);

    return this.getAll().pipe(
      map(users =>
        users.some(user => user.email?.trim().toLowerCase() === normalizedEmail)
      ),
      catchError(() => of(false))
    );
  }

  checkPhoneExists(phoneNumber: string): Observable<boolean> {
    const normalizedPhone = this.normalizePhone(phoneNumber);
    if (!normalizedPhone) return of(false);

    return this.getAll().pipe(
      map(users =>
        users.some(user => this.normalizePhone(user.phoneNumber ?? '') === normalizedPhone)
      ),
      catchError(() => of(false))
    );
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s()-]/g, '').trim();
  }
}