import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsService {
  private apiUrl = 'http://localhost:8080/api/logistics';

  constructor(private http: HttpClient) {}

  getLogisticsByMeeting(meetingId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${meetingId}/meetings`);
  }
}

