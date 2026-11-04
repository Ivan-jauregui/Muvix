import { PublicationImages } from "../../publication-images";
import { SelleableItem } from "../../selleable-item";

export interface BatchPublication extends SelleableItem { 
    type: 'BATCH'; 
    productIds: string[];
}