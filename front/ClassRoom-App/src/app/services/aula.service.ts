import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '@app/models/Aula';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  baseURL = 'https://localhost:5001/api/Aulas'

  constructor(private http: HttpClient) { }

  public getAulaByBlocoId(blocoId: number): Observable<Aula[]> {
    return this.http
      .get<Aula[]>(`${this.baseURL}/${blocoId}`)
      .pipe(take(1));
  }

  public saveAula(blocoId: number, aulas: Aula[]): Observable<Aula[]> {
    return this.http
      .put<Aula[]>(`${this.baseURL}/${blocoId}`, aulas)
      .pipe(take(1));
  }

  public deleteAula(blocoId: number, aulaId: number): Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${blocoId}/${aulaId}`)
      .pipe(take(1));
  }
}
