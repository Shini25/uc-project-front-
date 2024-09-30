import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoMeetingBase } from '../../models/infoMeetingBase.model';
@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8080/api/meetings';

  constructor(private http: HttpClient) {}

  scheduleMeeting(
    dateMeeting: Date,
    location: string,
    objet: string,
    meetingType: string,
    logistics: string[],
    observations: string[],
    organizersMail: string[],
    participantsMail: string[],
    addBy: string

  ): Observable<InfoMeetingBase> {
    const formData = new FormData();
    formData.append('dateMeeting', dateMeeting.toISOString());
    formData.append('location', location);
    formData.append('objet', objet);
    formData.append('meetingType', meetingType);
    formData.append('addBy', addBy);
    
    logistics.forEach(logistics => formData.append('logistics', logistics));
    observations.forEach(observations => formData.append('observations', observations));
    organizersMail.forEach(organizerMail => formData.append('organizersMail', organizerMail));
     participantsMail.forEach(participantMail => formData.append('participantsMail', participantMail));

    return this.http.post<InfoMeetingBase>(`${this.apiUrl}/schedule`, formData);
  }

  getAllMeetings(): Observable<InfoMeetingBase[]> {
    return this.http.get<InfoMeetingBase[]>(`${this.apiUrl}/all`);
  }

  getMeetingById(id: number): Observable<InfoMeetingBase> {
    return this.http.get<InfoMeetingBase>(`${this.apiUrl}/${id}`);
  }

  addAttendanceSheet(id: number, attendanceSheet: string, fileType: string, modifyby: string): Observable<void> {
    const formData = new FormData();
    formData.append('content', attendanceSheet);
    formData.append('fileType', fileType);
    formData.append('modifyby', modifyby);
    return this.http.put<void>(`${this.apiUrl}/${id}/addAttendanceSheet`, formData);
  }
}
