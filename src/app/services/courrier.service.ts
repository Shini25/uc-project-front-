import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courrier } from '../models/courrier.model';

@Injectable({
  providedIn: 'root'
})
export class CourrierService {
  private apiUrl = 'http://localhost:8080/api/courriers';

  constructor(private http: HttpClient) {}

  getAllCourriers(): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(this.apiUrl);
  }

  getCourrierById(id: number): Observable<Courrier> {
    return this.http.get<Courrier>(`${this.apiUrl}/${id}`);
  }

  createCourrier(titre: string, base64pdf: string): Observable<Courrier> {
    const formData = new FormData();

    formData.append('titre', titre);

    formData.append('contenue', base64pdf);

    
    return this.http.post<Courrier>(`${this.apiUrl}/archivage/personalise`, formData);
  }

  updateCourrier(id: number, courrier: Courrier): Observable<Courrier> {
    return this.http.put<Courrier>(`${this.apiUrl}/${id}`, courrier);
  }

  deleteCourrier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
