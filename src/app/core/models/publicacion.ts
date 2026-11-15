
import { PublicationImages } from "./publication-images";


export interface Publication{
    id?:string
    userId?:string;
    title:string;
    description:string;
    price:number;
    type: 'INDIVIDUAL' | 'BATCH';
    status: 'ACTIVE' | 'PAUSED' | 'RESERVERD' | 'SOLD'
    category:string;
    itemIds: string[];
    createdAt:string;
}