import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutreDocument } from '../../models/courriers/autreDocument.model';

@Injectable({
  providedIn: 'root'
})
export class AutreDocumentService {
    private apiUrl = 'http://localhost:8080/api/autre-documents';

    constructor(private http: HttpClient) {}

    getAllAutreDocuments(): Observable<AutreDocument[]> {
        return this.http.get<AutreDocument[]>(`${this.apiUrl}/all`);
    }
    
}