import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationalChartAudit } from '../../models/organizationalChartAudit.model';
@Injectable({
  providedIn: 'root'
})
export class OrganizationalChartAuditService {
  private apiUrl = 'http://localhost:8080/api/organizational-charts/audit';

  constructor(private http: HttpClient) {}

  getAllOrganizationalChartAudits(idOrganizationalChart: number): Observable<OrganizationalChartAudit[]> {
    return this.http.get<OrganizationalChartAudit[]>(`${this.apiUrl}/${idOrganizationalChart}`);
  }

}

