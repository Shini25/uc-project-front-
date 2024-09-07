import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livret } from '../../models/courriers/livret.model';

@Injectable({
  providedIn: 'root'
})
export class LivretService {
  private apiUrl = 'http://localhost:8080/api/livrets'; 

  constructor(private http: HttpClient) {}

  // Récupérer tous les livrets
  getAllLivrets(): Observable<Livret[]> {
    return this.http.get<Livret[]>(`${this.apiUrl}`);
  }

  // Récupérer un livret par ID
  getLivretById(id: number): Observable<Livret> {
    return this.http.get<Livret>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un livret
  updateLivret(id: number, livret: Livret): Observable<Livret> {
    return this.http.put<Livret>(`${this.apiUrl}/${id}`, livret);
  }

  // Supprimer un livret
  deleteLivret(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
