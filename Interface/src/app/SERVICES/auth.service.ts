import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = atob(token.split('.')[1]); // décodage base64
      return JSON.parse(payload);
    } catch (e) {
      console.error('Erreur de décodage du token:', e);
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.role : null;
  }

  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.id : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
