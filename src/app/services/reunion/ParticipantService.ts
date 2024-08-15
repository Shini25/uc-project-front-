import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = 'http://localhost:8080/api/participants';

  constructor(private http: HttpClient) {}

  getParticipantsByReunion(reunionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${reunionId}/reunions`);
  }
}