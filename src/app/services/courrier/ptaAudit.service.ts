import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PtaAudit } from '../../models/courriers/ptaAudit.model';

@Injectable({
  providedIn: 'root'
})  

export class PtaAuditService {
  private apiUrl = 'http://localhost:8080/api/pta-audit';

  constructor(private http: HttpClient) {}

  getAllPtasAuditByCourrierId(idCourrier: number): Observable<PtaAudit[]> {
    return this.http.get<PtaAudit[]>(`${this.apiUrl}/${idCourrier}`);
  }

}