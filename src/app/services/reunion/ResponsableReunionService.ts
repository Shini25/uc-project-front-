import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsableReunionService {
  private apiUrl = 'http://localhost:8080/api/responsables';

  constructor(private http: HttpClient) {}

  getResponsablesByReunion(reunionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${reunionId}/responsables`);
  }
}