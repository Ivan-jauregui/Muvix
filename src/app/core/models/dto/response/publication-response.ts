import { StorageItem } from "../../storage-item";

export interface PublicationResponse{
    id:string;
    userId:string;
    title:string;
    description:string;
    price:number;
    category:string;
    type: 'INDIVIDUAL' | 'BATCH';
    status: 'ACTIVE' | 'PAUSED' | 'RESERVED' | 'SOLD'
    coverImage:string;
    item:StorageItem[];
    createdAt:string;
}