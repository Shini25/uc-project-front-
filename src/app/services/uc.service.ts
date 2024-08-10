import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Uc } from '../models/uc.model';

@Injectable({
  providedIn: 'root'
})
export class UcService {
  private apiUrl = 'http://localhost:8080/api/uc';

  constructor(private http: HttpClient) {}

  createUc(uc: Uc, base64Photo: string, attributions: string[], motsDuChef: string[]): Observable<Uc> {
    const formData = new FormData();
    formData.append('uc', new Blob([JSON.stringify(uc)], { type: 'application/json' }));
    formData.append('photo', base64Photo);
    formData.append('attributions', new Blob([JSON.stringify(attributions)], { type: 'application/json' }));
    formData.append('motsDuChef', new Blob([JSON.stringify(motsDuChef)], { type: 'application/json' }));

    return this.http.post<Uc>(`${this.apiUrl}/create`, formData);
  }


  // Get all Ucs
  getAllUcs(): Observable<Uc[]> {
    return this.http.get<Uc[]>(`${this.apiUrl}/list`);
  }

  // Get Uc by matricule
  getUcById(matricule: string): Observable<Uc> {
    return this.http.get<Uc>(`${this.apiUrl}/${matricule}`);
  }

  // Update Uc
  updateUc(matricule: string, uc: Uc): Observable<Uc> {
    return this.http.put<Uc>(`${this.apiUrl}/${matricule}`, uc);
  }

  // Delete Uc
  deleteUc(matricule: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matricule}`);
  }
}