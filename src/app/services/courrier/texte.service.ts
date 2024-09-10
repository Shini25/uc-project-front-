import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Texte } from '../../models/courriers/texte.model';

@Injectable({
  providedIn: 'root'
})

export class TexteService {
  private apiUrl = 'http://localhost:8080/api/textes';

  constructor(private http: HttpClient) {}

  getAllTextes(): Observable<Texte[]> {
    return this.http.get<Texte[]>(this.apiUrl+'/all');
  }
}