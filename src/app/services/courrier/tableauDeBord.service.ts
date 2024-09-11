import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableauDeBord } from '../../models/courriers/accesReserve.model';

@Injectable({
  providedIn: 'root'
})
export class TableauDeBordService {
    private apiUrl = 'http://localhost:8080/api/acces-reserves';

    constructor(private http: HttpClient) {}

    getAllTableauDeBords(): Observable<TableauDeBord[]> {
        return this.http.get<TableauDeBord[]>(this.apiUrl + '/all');
    }
}