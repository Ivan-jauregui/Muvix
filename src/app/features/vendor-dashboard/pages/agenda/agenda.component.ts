
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../../core/services/reservation/reservation.service';
import { ReservationResponse } from '../../../../core/models/dto/response/resevation-response';
import {
  heroCalendarDays, heroKey, heroShieldCheck, heroCheck, heroXMark
} from '@ng-icons/heroicons/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';


@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({
    heroCalendarDays, heroKey, heroShieldCheck, heroCheck, heroXMark
  })],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {

  private reservationService = inject(ReservationService);

  reservations = signal<ReservationResponse[]>([]);
  loading = signal<boolean>(true);
  selectedReservation = signal<ReservationResponse | null>(null);
  pin = signal('');
  pinError = signal<string | null>(null);
  validating = signal(false);


  ngOnInit(): void {
    this.reservationService.getReceivedReservations().subscribe({
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

  openPinModal(reservation: ReservationResponse) {
    this.pin.set('');
    this.pinError.set(null);
    this.selectedReservation.set(reservation);
  }

  closePinModal() {
    this.selectedReservation.set(null);
  }

  onPinInput(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.pin.set(value);
    this.pinError.set(null);
  }
  validatePin() {
    const reservation = this.selectedReservation();
    if (!reservation || this.pin().length < 4 || this.validating()) return;

    this.validating.set(true);

    this.reservationService.validatePin(reservation.id!, this.pin()).subscribe({
      next: (isValid: boolean) => {
        this.validating.set(false);

        if (isValid) {
          this.closePinModal();
        } else {
          this.pinError.set('El PIN es incorrecto. Probá de nuevo.');
        }
      },
      error: () => {
        this.validating.set(false);
        this.pinError.set('Ocurrió un error al validar. Probá de nuevo.');
      },
    });
  }
}
