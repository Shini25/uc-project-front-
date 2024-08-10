import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UcMotDuChefService {
  private apiUrl = 'http://localhost:8080/api/ucs';

  constructor(private http: HttpClient) {}

  getMotDuChefsByUc(ucId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${ucId}/motduchefs`);
  }
}