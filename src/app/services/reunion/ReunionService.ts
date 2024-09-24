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
    dateReunion: Date,
    lieu: string,
    objet: string,
    reunionType: string,
    logistique: string[],
    observations: string[],
    responsablesMail: string[],
    participantsMail: string[]
  ): Observable<InfoReunionBase> {
    const formData = new FormData();
    formData.append('dateReunion', dateReunion.toISOString());
    formData.append('lieu', lieu);
    formData.append('objet', objet);
    formData.append('reunionType', reunionType);
    logistique.forEach(logistique => formData.append('logistique', logistique));
    observations.forEach(observations => formData.append('observations', observations));
    responsablesMail.forEach(responsableMail => formData.append('responsablesMail', responsableMail));
    participantsMail.forEach(participantMail => formData.append('participantsMail', participantMail));

    return this.http.post<InfoReunionBase>(`${this.apiUrl}/planifier`, formData);
  }

  getAllReunions(): Observable<InfoReunionBase[]> {
    return this.http.get<InfoReunionBase[]>(`${this.apiUrl}/all`);
  }

  getReunionById(id: number): Observable<InfoReunionBase> {
    return this.http.get<InfoReunionBase>(`${this.apiUrl}/${id}`);
  }
}
