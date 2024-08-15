import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdreDuJourService {
  private apiUrl = 'http://localhost:8080/api/ordredujour';

  constructor(private http: HttpClient) {}

  getOrdreDuJourByReunion(reunionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${reunionId}/ordredujour`);
  }
}