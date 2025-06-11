import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tache {
  id?: string;
  title: string;
  description: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TacheService {

  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.API_URI, { headers: this.getAuthHeaders() });
  }

  getUnTache(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.API_URI}/${id}`, { headers: this.getAuthHeaders() });
  }

  addTache(tache: Tache): Observable<any> {
    return this.http.post(`${this.API_URI}`, tache, { headers: this.getAuthHeaders() });
  }

  deleteTache(id: string): Observable<any> {
    return this.http.delete(`${this.API_URI}/${id}`, { headers: this.getAuthHeaders() });
  }

  editTache(id: string, updatedTache: Tache): Observable<any> {
    return this.http.put(`${this.API_URI}/${id}`, updatedTache, { headers: this.getAuthHeaders() });
  }
}
