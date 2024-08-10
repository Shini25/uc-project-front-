import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UcPhotoService {
  private apiUrl = 'http://localhost:8080/api/ucs';

  constructor(private http: HttpClient) {}

  getPhotosByUc(ucId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${ucId}/photos/base64`);
  }

  getPhotoById(photoId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/photos/${photoId}/base64`);
  }
}