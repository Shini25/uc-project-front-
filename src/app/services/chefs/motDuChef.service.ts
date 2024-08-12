import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class motDuChefService {
  private apiUrl = 'http://localhost:8080/api/chefs';

  constructor(private http: HttpClient) {}

  getMotDuChefsByChef(chefId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${chefId}/motduchefs`);
  }
}