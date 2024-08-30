import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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

  createPtaPersonalise(titre: string, base64Contenue: string, typeDePta: string, typeDeContenue: string): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64Contenue);
    formData.append('typeDePta', typeDePta);
    formData.append('typeDeContenue', typeDeContenue);

    return this.http.post(`${this.apiUrl}/insertion/personalise`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error creating PTA:', error);
    return throwError('An error occurred while creating the PTA. Please try again later.');
  }
}
