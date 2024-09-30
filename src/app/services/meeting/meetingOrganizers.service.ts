import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingOrganizersService {
  private apiUrl = 'http://localhost:8080/api/meetingOrganizers';

  constructor(private http: HttpClient) {}

  getOrganizersByMeeting(meetingId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${meetingId}/meetings`);
  }
}