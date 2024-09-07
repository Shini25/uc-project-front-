import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Courrier } from '../../models/courriers/courrier.model';

@Injectable({
  providedIn: 'root'
})
export class CourrierService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // creation livret
  creationLivret(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/livrets/insertion/personalise`, formData);
  }

  // creation pta
  creationPta(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/ptas/insertion/personalise`, formData);
  }

  // creation activite
  createActivite(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/activites/insertion/personalise`, formData);
  }

  createTexte(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/textes/insertion/personalise`, formData);
  } 

  createAutreDocument(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/autreDocument/insertion/personalise`, formData);
  }

  createTableauDeBord(
    titre: string, 
    base64pdf: string, 
    type: string, 
    typeDeContenue: string, 
    userId: string
  ): Observable<Courrier> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('contenue', base64pdf);
    formData.append('type', type);
    formData.append('typeDeContenue', typeDeContenue);
    formData.append('userId', userId);

    return this.http.post<Courrier>(`${this.apiUrl}/acces-reserves/insertion/personalise`, formData);
  }


}


