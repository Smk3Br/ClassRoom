import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bloco } from '../models/Bloco';

@Injectable({
  providedIn: 'root'
})
export class BlocoService {
  baseURL = 'https://localhost:5001/api/Blocos'

  constructor(private http: HttpClient) { }

  public getBloco(): Observable<Bloco[]> {
    return this.http.get<Bloco[]>(this.baseURL);
  }

  public getBlocosByNome(nome: string): Observable<Bloco[]> {
    return this.http.get<Bloco[]>(`${this.baseURL}/${nome}/nome`);
  }

  public getBlocoById(id: string): Observable<Bloco> {
    return this.http.get<Bloco>(`${this.baseURL}/${id}`);
  }
}
