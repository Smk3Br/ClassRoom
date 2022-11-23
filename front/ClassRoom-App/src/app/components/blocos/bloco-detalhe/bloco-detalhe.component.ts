import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bloco-detalhe',
  templateUrl: './bloco-detalhe.component.html',
  styleUrls: ['./bloco-detalhe.component.scss']
})
export class BlocoDetalheComponent implements OnInit {
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
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

}
