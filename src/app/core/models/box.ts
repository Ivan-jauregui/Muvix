import { PublicationResponse } from "./dto/response/publication-response";
import { Publication } from "./publicacion";

export interface Box{
    id?:string
    title:string;
    publications:PublicationResponse[]
    createdAt:string;
    userId:string;
}