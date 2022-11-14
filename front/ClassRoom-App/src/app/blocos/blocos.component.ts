import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blocos',
  templateUrl: './blocos.component.html',
  styleUrls: ['./blocos.component.scss']
})
export class BlocosComponent implements OnInit {

  public blocos: any = [];
  public blocosFiltrados: any = [];

  widthImg: number = 150;
  marginImg: number = 2;
  showImg = false;
  private _filtroLista : string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value
    this.blocosFiltrados = this.filtroLista ? this.filtrarBlocos(this.filtroLista) : this.blocos
  }

  filtrarBlocos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLowerCase()
    return this.blocos.filter(
      (bloco: { nome : string; local : string })=> bloco.nome.toLowerCase().indexOf(filtrarPor) !== -1 ||
      bloco.local.toLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getBlocos();
  }

  public getBlocos(): void {
    this.http.get('https://localhost:5001/api/Blocos').subscribe(
      response => {
        this.blocos = response
        this.blocosFiltrados = this.blocos
      },
      error => console.log(error)
    );
  }

}
