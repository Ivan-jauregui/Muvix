import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/users"

  getById(id:string):Observable<User>{
    return this.http.get<User>(this.apiUrl+"/"+id)
  }

  update(id:string,user:User){
    return this.http.patch<User>(`${this.apiUrl}/${id}`,user)
  }
}
