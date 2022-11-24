import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';
import { Bloco } from '../models/Bloco';

@Injectable({
  providedIn: 'root'
})
export class BlocoService {
  baseURL = environment.apiURL + 'api/Blocos'

  constructor(private http: HttpClient) { }

  public getBloco(): Observable<Bloco[]> {
    return this.http
      .get<Bloco[]>(this.baseURL)
      .pipe(take(1));
  }

  public getBlocosByNome(nome: string): Observable<Bloco[]> {
    return this.http
      .get<Bloco[]>(`${this.baseURL}/${nome}/nome`)
      .pipe(take(1));
  }

  public getBlocoById(id: number): Observable<Bloco> {
    return this.http
      .get<Bloco>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(bloco: Bloco): Observable<Bloco> {
    return this.http
      .post<Bloco>(this.baseURL, bloco)
      .pipe(take(1));
  }

  public put(bloco: Bloco): Observable<Bloco> {
    return this.http
      .put<Bloco>(`${this.baseURL}/${bloco.id}`, bloco)
      .pipe(take(1));
  }

  public deleteBloco(id: number,): Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public postUpload(blocoId: number, file: File): Observable<Bloco> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Bloco>(`${this.baseURL}/upload-image/${blocoId}`, formData)
      .pipe(take(1));
  }
}
