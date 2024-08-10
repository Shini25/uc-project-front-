import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UcAttributionService {
  private apiUrl = 'http://localhost:8080/api/ucs';

  constructor(private http: HttpClient) {}

  getAttributionsByUc(ucId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${ucId}/attributions`);
  }
}