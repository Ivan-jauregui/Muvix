import { Category } from "./category";
import { PublicationImages } from "./publication-images";


export interface Publication{
    id?:string;
    title:string;
    images?: PublicationImages[]; 
    description:string;
    price:number;
    condition:string;
    publicationId:number;
    category:Category;
    type:string;
    userId?:string;
    active:boolean;
    createdAt:Date;
}