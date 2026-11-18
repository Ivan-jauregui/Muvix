
export interface Publication{
    id?:string
    userId?:string;
    title:string;
    description:string;
    price:number;
    type: 'INDIVIDUAL' | 'BATCH';
    status: 'ACTIVE' | 'PAUSED' | 'RESERVED' | 'SOLD'
    category:string;
    itemIds: string[];
    createdAt:string;
}