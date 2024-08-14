import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pta } from '../models/pta.model';

@Injectable({
  providedIn: 'root'
})
export class PtaService {
  private apiUrl = 'http://localhost:8080/api/ptas';

  constructor(private http: HttpClient) {}

  getAllPta(): Observable<Pta[]> {
    return this.http.get<Pta[]>(this.apiUrl);
  }

  getPtaById(id: number): Observable<Pta> {
    return this.http.get<Pta>(`${this.apiUrl}/${id}`);
  }

  createPta(titre: string, base64pdf: string, typeDePta: string): Observable<Pta> {
    const formData = new FormData();

    formData.append('typeDePta', typeDePta);

    formData.append('titre', titre);

    formData.append('contenue', base64pdf);
    
    return this.http.post<Pta>(`${this.apiUrl}/insertion/personalise`, formData);
  }
}
