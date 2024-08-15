import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoReunionBase } from '../../models/infoReunionBase.model';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
  private apiUrl = 'http://localhost:8080/api/reunions';

  constructor(private http: HttpClient) {}

  planifierReunion(
    titre: string,
    dateReunion: Date,
    lieu: string,
    objet: string,
    ordreDuJourDescriptions: string[],
    responsablesMatricules: string[],
    participantsMatricules: string[]
  ): Observable<InfoReunionBase> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('dateReunion', dateReunion.toISOString());
    formData.append('lieu', lieu);
    formData.append('objet', objet);
    ordreDuJourDescriptions.forEach(description => formData.append('ordreDuJourDescriptions', description));
    responsablesMatricules.forEach(matricule => formData.append('responsablesMatricules', matricule));
    participantsMatricules.forEach(matricule => formData.append('participantsMatricules', matricule));

    return this.http.post<InfoReunionBase>(`${this.apiUrl}/planifier`, formData);
  }

  getAllReunions(): Observable<InfoReunionBase[]> {
    return this.http.get<InfoReunionBase[]>(`${this.apiUrl}/all`);
  }

  getReunionById(id: number): Observable<InfoReunionBase> {
    return this.http.get<InfoReunionBase>(`${this.apiUrl}/${id}`);
  }
}
