import { Category } from "./category";
import { PublicationImages } from "./publication-images";

export interface SelleableItem { 
    id?: number;
    sellerId: number; 
    title: string; 
    description: string; 
    price: number; 
    condition: string; 
    category: Category; 
    createdAt?: string; 
}