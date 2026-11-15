export interface Reservation {
  id?: string;
  publicationId: string;
  userId: string;
  price: number;
  pickup_date: string | null;
  pin: string | null;
}