
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../../core/services/reservation/reservation.service';
import { ReservationResponse } from '../../../../core/models/dto/response/resevation-response';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {

  private reservationService = inject(ReservationService);

  reservations = signal<ReservationResponse[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.reservationService.getReservationsByUser().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en la carga de reservas:', err);
        this.loading.set(false);
      }
    });
  }
}
