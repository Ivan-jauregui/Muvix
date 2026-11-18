import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, map, switchMap } from 'rxjs';
import { ReservationResponse } from '../../models/dto/response/resevation-response';
import { PublicationService } from '../publication/publication-service';
import { UserService } from '../../../features/profile/pages/service/user.service';
import { AuthService } from '../auth/auth.service';
import { Reservation } from '../../models/dto/request/reservation';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/reservations';

  private publicationService = inject(PublicationService);
  private authService = inject(AuthService)
  private userService = inject(UserService);

  save(req: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, req);
  }

  getAll(): Observable<ReservationResponse[]> {
    return this.http.get<Reservation[]>(this.apiUrl).pipe(
      switchMap(reservations =>
        reservations.length
          ? forkJoin(
            reservations.map(reservation =>
              this.mapReservation(reservation)
            )
          )
          : of([])
      )
    );
  }

  getById(id: string): Observable<ReservationResponse> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`).pipe(
      switchMap(reservation => this.mapReservation(reservation))
    );
  }

  private mapReservation(
    reservation: Reservation
  ): Observable<ReservationResponse> {

    return forkJoin({
      publication: this.publicationService.getById(reservation.publicationId),
      user: this.userService.getById(reservation.userId)
    }).pipe(
      map(({ publication, user }) => ({
        id: reservation.id,
        publication: publication,
        user: user,
        price: reservation.price,
        pickup_date: reservation.pickup_date,
        pin: reservation.pin
      }))
    );
  }

  // Reservas que yo hice como comprador
  getMyPurchases(): Observable<ReservationResponse[]> {
    const currentUserId = this.authService.currentUser()?.id;

    return this.getAll().pipe(
      map(reservations =>
        currentUserId
          ? reservations.filter(res => res.user.id === currentUserId)
          : []
      )
    );
  }

  // Reservas que le hicieron a mis productos
  getReceivedReservations(): Observable<ReservationResponse[]> {
    const currentUserId = this.authService.currentUser()?.id;

    return this.getAll().pipe(
      map(reservations =>
        currentUserId
          ? reservations.filter(res => res.publication?.userId === currentUserId)
          : []
      )
    );
  }



  validatePin(id: string, pin: string): Observable<boolean> {
    return this.getById(id).pipe(
      map((reservation: ReservationResponse) => {
        return reservation.pin === pin;
      })
    );
  }

}
