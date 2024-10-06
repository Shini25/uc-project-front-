import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

    private apiUrl = 'http://localhost:8080/api/send-mail';

    constructor(private http: HttpClient) {}

    sendReminderEmail(email: string, objet: string, date: string, lieu: string): Observable<string> {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('objet', objet);
        formData.append('date', date);
        formData.append('lieu', lieu);
        return this.http.post(`${this.apiUrl}/meeting`, formData, { responseType: 'text' });
    }
}
