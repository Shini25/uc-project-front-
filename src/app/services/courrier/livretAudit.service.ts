import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LivretAudit } from "../../models/courriers/livretAudit.model";

@Injectable({
    providedIn: 'root'
})
export class LivretAuditService {
    private apiUrl = 'http://localhost:8080/api/livret-audit';
    constructor(private http: HttpClient) {}

    getAllLivretsAuditByCourrierId(idCourrier: number): Observable<LivretAudit[]> {
      return this.http.get<LivretAudit[]>(`${this.apiUrl}/${idCourrier}`);
    }
}