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

  updatePta(pta: Pta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${pta.idCourrier}`, pta);
  }

}