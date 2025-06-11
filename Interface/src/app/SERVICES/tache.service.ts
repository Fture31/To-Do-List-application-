import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Tache {
  id_tache?: string;
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

  getTaches() {
    return this.http.get<Tache[]>(`${this.API_URI}`);
  }

  getUnTache(id: string) {
    return this.http.get<Tache>(`${this.API_URI}/${id}`);
  }

  addTache(tache: Tache) {
    return this.http.post(`${this.API_URI}`, tache);
  }

  deleteTache(id: string) {
    return this.http.delete(`${this.API_URI}/${id}`);
  }

  editTache(id: string, updatedTache: Tache) {
    return this.http.put(`${this.API_URI}/${id}`, updatedTache);
  }
}
