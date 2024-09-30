import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingParticipantsService {
  private apiUrl = 'http://localhost:8080/api/meetingParticipants';

  constructor(private http: HttpClient) {}

  getParticipantsByMeeting(meetingId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${meetingId}/meetings`);
  }
}