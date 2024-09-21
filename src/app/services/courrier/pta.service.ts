import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pta } from '../../models/courriers/pta.model';

@Injectable({
  providedIn: 'root'
})  

export class PtaService {
  private apiUrl = 'http://localhost:8080/api/ptas';

  constructor(private http: HttpClient) {}

  getAllPtas(): Observable<Pta[]> {
    return this.http.get<Pta[]>(`${this.apiUrl}/all`);
  }

  updatePta(id: number, contenue: string, modifyby: string): Observable<void> {

    const formData = new FormData();
    formData.append('contenue', contenue);
    formData.append('modifyby', modifyby);
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  validerPta(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/valider/${id}`, null);
  }

}