import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Bloco } from '@app/models/Bloco';
import { BlocoService } from '@app/services/bloco.service';

@Component({
  selector: 'app-bloco-lista',
  templateUrl: './bloco-lista.component.html',
  styleUrls: ['./bloco-lista.component.scss']
})
export class BlocoListaComponent implements OnInit {
  modalRef!: BsModalRef;
  public blocos: Bloco[] = [];
  public blocosFiltrados: any = [];
  public blocoId: number;

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
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.spinner.show();
    this.carregarBlocos();
  }

  public carregarBlocos(): void {
    this.blocoService.getBloco().subscribe({
      next: (blocos: Bloco[]) => {
        this.blocos = blocos
        this.blocosFiltrados = this.blocos
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Não foi possível carregar os blocos', 'Erro');
      },
      complete: () => {this.spinner.hide();}
    });
  }

  openModal(event: any, template: TemplateRef<any>, blocoId: number): void {
    event.stopPropagation();
    this.blocoId = blocoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.blocoService.deleteBloco(this.blocoId).subscribe(
      (result: any) => {
        if(result.message === 'Deletado'){
          this.toastr.success('Bloco deletado com sucesso!', 'Deletado');
          this.spinner.hide();
          this.carregarBlocos();
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o bloco ${this.blocoId}`, 'Erro!')
        this.spinner.hide();
        console.log(error);
      },
      () => {this.spinner.hide();}
    );

  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheBloco(id: number): void{
    this.router.navigate([`blocos/detalhe/${id}`]);
  }

}
