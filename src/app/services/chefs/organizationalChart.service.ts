import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationalChart } from '../../models/organizationalChart.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalChartService {
    private apiUrl = 'http://localhost:8080/api/organizational-charts';

    constructor(private http: HttpClient) {}

    getAllOrganizationalCharts(): Observable<OrganizationalChart[]> {
        return this.http.get<OrganizationalChart[]>(this.apiUrl);
    }

    createOrganizationalChart(type: string, contenue: string, addby: string, filetype: string): Observable<OrganizationalChart> {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('contenue', contenue);
        formData.append('addby', addby);
        formData.append('filetype', filetype);
        return this.http.post<OrganizationalChart>(`${this.apiUrl}/add`, formData);
    }

    updateOrganizationalChart(id: number, organizationalChart: OrganizationalChart): Observable<OrganizationalChart> {
        return this.http.put<OrganizationalChart>(`${this.apiUrl}/${id}`, organizationalChart);
    }

    deleteOrganizationalChart(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}