import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Bloco } from '@app/models/Bloco';
import { BlocoService } from '@app/services/bloco.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bloco-detalhe',
  templateUrl: './bloco-detalhe.component.html',
  styleUrls: ['./bloco-detalhe.component.scss']
})
export class BlocoDetalheComponent implements OnInit {
  bloco: Bloco;
  form!: FormGroup;
  modoSalvar = 'post'

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private router: ActivatedRoute,
              private blocoService: BlocoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  public carregarBloco(): void {
    const blocoIdParam = this.router.snapshot.paramMap.get('id');

    if(blocoIdParam !== null){
      this.spinner.show();

      this.modoSalvar = 'put';

      this.blocoService.getBlocoById(+blocoIdParam).subscribe({
        next: (bloco: Bloco) => {
          this.bloco = {...bloco};
          this.form.patchValue(this.bloco);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar o Bloco', 'Erro!');
          console.error(error);
        },
        complete: () => {this.spinner.hide()}
      });
    }
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
      imageURL: ['', Validators.required]
    })
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid' : campoForm.errors && campoForm.touched};
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid){

      this.bloco = (this.modoSalvar === 'post')
                ? {...this.form.value}
                : {id: this.bloco.id, ...this.form.value};
      
      this.blocoService[this.modoSalvar](this.bloco).subscribe({
        next: () => {this.toastr.success('Bloco salvo com Sucesso!', 'Sucesso!')},
        error: (error: any) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar o Bloco', 'Erro!')
        },
        complete: () => {this.spinner.hide()}
      });
    }
  }
}
