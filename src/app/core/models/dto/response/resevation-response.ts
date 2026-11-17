import { User } from "../../user";
import { PublicationResponse } from "./publication-response";

export interface ReservationResponse {
  id?: string;
  publication: PublicationResponse;
  user: User;
  price: number;
  pickup_date: string | null;
  pin: string | null;
}