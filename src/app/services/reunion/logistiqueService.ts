import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogistiqueService {
  private apiUrl = 'http://localhost:8080/api/logistique';

  constructor(private http: HttpClient) {}

  getLogistiqueByReunion(reunionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${reunionId}/logistique`);
  }
}

