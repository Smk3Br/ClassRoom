import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  user = {} as User
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) { }

  get f(): any { return this.form.controls; }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confPassword')
    }

    this.form = this.fb.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      userName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      confPassword: ['', Validators.required]
    }, formOptions)
  }

  register(): void {
    this.user = { ...this.form.value};
    this.accountService.register(this.user).subscribe(
      () => {this.router.navigateByUrl('/home').then(() => {window.location.reload()})},
      (error: any) => {this.toastr.error(error.error)}
    )
  }

}
