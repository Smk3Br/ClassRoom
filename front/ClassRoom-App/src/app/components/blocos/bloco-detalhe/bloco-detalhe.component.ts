import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bloco } from '@app/models/Bloco';
import { Aula } from '@app/models/Aula'
import { BlocoService } from '@app/services/bloco.service';
import { AulaService } from '@app/services/aula.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-bloco-detalhe',
  templateUrl: './bloco-detalhe.component.html',
  styleUrls: ['./bloco-detalhe.component.scss']
})
export class BlocoDetalheComponent implements OnInit {

  modalRef: BsModalRef;
  blocoId: number;
  bloco: Bloco;
  form!: FormGroup;
  modoSalvar = 'post';
  aulaAtual = {id: 0, nome: '', indice: 0};

  get aulas(): FormArray {
    return this.form.get('aulas') as FormArray
  }

  get modoEditar(): boolean {
    return this.modoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder,
              private localeSevice: BsLocaleService,
              private activatedRouter: ActivatedRoute,
              private blocoService: BlocoService,
              private aulaService: AulaService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private router: Router)
  {
    this.localeSevice.use('pt-br')
  }

  public carregarBloco(): void {
    this.blocoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if(this.blocoId !== null && this.blocoId !== 0){
      this.spinner.show();

      this.modoSalvar = 'put';

      this.blocoService.getBlocoById(this.blocoId).subscribe(
        (bloco: Bloco) => {
          this.bloco = {...bloco};
          this.form.patchValue(this.bloco);
          this.carregarAulas();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar o Bloco', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public carregarAulas(): void{
    this.aulaService.getAulaByBlocoId(this.blocoId).subscribe(
      (aulasRetorno: Aula[]) => {
        aulasRetorno.forEach(aula => {
          this.aulas.push(this.criarAula(aula));
        })
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar as Aulas', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  ngOnInit(): void {
    this.carregarBloco();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      local: ['', Validators.required],
      statusBloco: ['', Validators.required],
      imageURL: ['', Validators.required],
      aulas: this.fb.array([])
    })
  }

  adicionarAula(): void {
    this.aulas.push(this.criarAula({id: 0} as Aula));
  }

  criarAula(aula: Aula): FormGroup {
    return this.fb.group({
      id: [aula.id],
      nome: [aula.nome, Validators.required],
      curso: [aula.curso, Validators.required],
      nomeProfessor: [aula.nomeProfessor, Validators.required],
      dataAula: [aula.dataAula]
    });
  }

  public retornaTituloAula(nome: string): string {
    return nome === null || nome === ''
            ? 'Nome da aula'
            : nome
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid' : campoForm.errors && campoForm.touched};
  }

  public salvarBloco(): void {
    this.spinner.show();
    if (this.form.valid){

      this.bloco = (this.modoSalvar === 'post')
                ? {...this.form.value}
                : {id: this.bloco.id, ...this.form.value};

      this.blocoService[this.modoSalvar](this.bloco).subscribe({
        next: (blocoRetorno: Bloco) => {
          this.toastr.success('Bloco salvo com Sucesso!', 'Sucesso!');
          this.router.navigate([`blocos/detalhe/${blocoRetorno.id}`]);
        },
        error: (error: any) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar o Bloco', 'Erro!');
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  public salvarAulas(): void{
    if (this.form.controls['aulas'].valid) {
      this.spinner.show();
      this.aulaService.saveAula(this.blocoId, this.form.value.aulas)
        .subscribe(
          () => {
            this.toastr.success('Aulas salvas com Sucesso!', 'Sucesso!');
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar Aulas!', 'Erro!');
            console.error(error);
          }
        ).add(()=>{this.spinner.hide()})
    }
  }

  public removerAula(template: TemplateRef<any>, indice: number): void {

    this.aulaAtual.id = this.aulas.get(indice + '.id').value;
    this.aulaAtual.nome = this.aulas.get(indice + '.nome').value;
    this.aulaAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirmDeleteAula(): void{
    this.modalRef.hide();
    this.spinner.show();

    this.aulaService.deleteAula(this.blocoId, this.aulaAtual.id).subscribe({
      next: () => {
        this.toastr.success('Aula deletada com sucesso!', 'Sucesso!');
        this.aulas.removeAt(this.aulaAtual.indice);
      },
      error: (error: any) => {
        this.toastr.error(`Falha ao deletar Aula ${this.aulaAtual.id}`, 'Erro!')
        console.error(error);
      }
    }).add(()=>{this.spinner.hide()})
  };

  declineDeleteAula(): void{
    this.modalRef.hide();
  };

}
