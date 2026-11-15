import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/users";

  currentUser = signal<User | null>(null);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  register(req: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, req);
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
}