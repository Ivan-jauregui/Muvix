
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReservationService } from '../../../../core/services/reservation/reservation.service';
import { ReservationResponse } from '../../../../core/models/dto/response/resevation-response';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCalendarDays,
  heroLockClosed,
  heroBookmark
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [
    provideIcons({
      heroCalendarDays,
      heroLockClosed,
      heroBookmark
    })
  ],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent implements OnInit {

  private reservationService = inject(ReservationService);

  reservations = signal<ReservationResponse[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.reservationService.getReservationsByUser().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

}
