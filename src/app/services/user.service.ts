import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User_account } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private numeroKey = 'userNumero';
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  addUser(user_account: User_account): Observable<User_account> {
    return this.http.post<User_account>(`${this.apiUrl}/adduser`, user_account);
  }

  checkUsernameExists(numero: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-numero?numero=${numero}`);
  }

  setNumero(numero: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.numeroKey, numero);
      console.log('Numero stored in UserService:', numero); // Log the stored numero
    } else {
      console.error('localStorage is not available');
    }
  }

  getNumero(): string | null {
    if (typeof localStorage !== 'undefined') {
      const numero = localStorage.getItem(this.numeroKey);
      console.log('Numero retrieved from UserService:', numero); // Log the retrieved numero
      return numero;
    } else {
      console.error('localStorage is not available');
      return null;
    }
  }

  getUserByNumero(numero: string): Observable<User_account> {
    // header token
    const token = this.authService.getToken();
    console.log('Token ito ilay  token:', token);
    if (!token) {
      console.error('No token found');
      throw new Error('No token found');
    }
    return this.http.get<User_account>(`${this.apiUrl}/${numero}`, {
      headers: {
        Authorization: `Bearer ${token}`  // Ajout du token dans l'en-tête
      } 
    });
  }

  getUserInfo(): Observable<User_account> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    // Ajout du token à l'entête de la requête
    return this.http.get<User_account>(`${this.apiUrl}/user-info`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
  }
  
}