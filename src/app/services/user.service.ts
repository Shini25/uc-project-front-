import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User_account } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private matriculeKey = 'userMatricule';

  constructor(private http: HttpClient) {}

  addUser(user_account: User_account): Observable<User_account> {
    return this.http.post<User_account>(`${this.apiUrl}/adduser`, user_account);
  }

  checkUsernameExists(matricule: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-matricule?matricule=${matricule}`);
  }

  setMatricule(matricule: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.matriculeKey, matricule);
      console.log('Matricule stored in UserService:', matricule); // Log the stored matricule
    } else {
      console.error('localStorage is not available');
    }
  }

  getMatricule(): string | null {
    if (typeof localStorage !== 'undefined') {
      const matricule = localStorage.getItem(this.matriculeKey);
      console.log('Matricule retrieved from UserService:', matricule); // Log the retrieved matricule
      return matricule;
    } else {
      console.error('localStorage is not available');
      return null;
    }
  }

  getUserByMatricule(matricule: string): Observable<User_account> {
    return this.http.get<User_account>(`${this.apiUrl}/${matricule}`);
  }
}