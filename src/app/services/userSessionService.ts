import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private userNumeroKey = 'userNumero';

  setNumero(numero: string) {
    sessionStorage.setItem(this.userNumeroKey, numero);
    console.log('Numero stored in sessionStorage:', numero); // Debug log
  }

  getNumero(): string | null {
    const numero = sessionStorage.getItem(this.userNumeroKey);
    console.log('Numero retrieved from sessionStorage:', numero); // Debug log
    return numero;
  }

  clearNumero() {
    sessionStorage.removeItem(this.userNumeroKey);
  }
}

