import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activite } from '../../models/courriers/activite.model';

@Injectable({
  providedIn: 'root'
})

export class ActiviteService {
  private apiUrl = 'http://localhost:8080/api/activites';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les activités
  getAllActivites(): Observable<Activite[]> {
    return this.http.get<Activite[]>(`${this.apiUrl}/all`);
  }
}