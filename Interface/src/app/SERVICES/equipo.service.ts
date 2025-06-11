import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Article {
  id_article?: string;
  title: string;
  description: string;
  created_at?: string;
}
@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEquipos() {
    return this.http.get<Article[]>(`${this.API_URI}`);
  }

  getUnEquipo(id: string) {
    return this.http.get<Article>(`${this.API_URI}/${id}`);
  }

  addEquipo(article: Article) {
    return this.http.post(`${this.API_URI}`, article);
  }

  deleteEquipo(id: string) {
    return this.http.delete(`${this.API_URI}/${id}`);
  }

  editEquipo(id: string, updatedArticle: Article) {
    return this.http.put(`${this.API_URI}/${id}`, updatedArticle);
  }
}
