import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) { }

  login(credentials: { numero: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Méthodes pour stocker et récupérer le token JWT
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  // Méthode pour supprimer le token lors de la déconnexion
  logout() {
    
    localStorage.removeItem('jwtToken');
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }
}