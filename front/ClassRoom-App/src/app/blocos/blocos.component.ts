import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Bloco } from '../models/Bloco';
import { BlocoService } from '../services/bloco.service';

@Component({
  selector: 'app-blocos',
  templateUrl: './blocos.component.html',
  styleUrls: ['./blocos.component.scss'],
})
export class BlocosComponent implements OnInit {
  modalRef!: BsModalRef;
  public blocos: Bloco[] = [];
  public blocosFiltrados: any = [];

  public widthImg: number = 150;
  public marginImg: number = 2;
  public showImg = false;
  private _filtroLista : string = '';

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value
    this.blocosFiltrados = this.filtroLista ? this.filtrarBlocos(this.filtroLista) : this.blocos
  }

  public filtrarBlocos(filtrarPor: string): Bloco[] {
    filtrarPor = filtrarPor.toLowerCase()
    return this.blocos.filter(
      (bloco: { nome : string; local : string })=> bloco.nome.toLowerCase().indexOf(filtrarPor) !== -1 ||
      bloco.local.toLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    private blocoService: BlocoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  public ngOnInit() {
    this.spinner.show();
    this.getBlocos();
  }

  public getBlocos(): void {
    const observer = {
      next: (blocos: Bloco[]) => {
        this.blocos = blocos
        this.blocosFiltrados = this.blocos
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Não foi possível carregar os blocos', 'Erro');
      },
      complete: () => {this.spinner.hide();}
    }

    this.blocoService.getBloco().subscribe(observer);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.toastr.success('Bloco deletado com sucesso!', 'Deletado');
  }

  decline(): void {
    this.modalRef.hide();
  }
}
