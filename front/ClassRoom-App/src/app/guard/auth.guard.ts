import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private toastr: ToastrService){}

  canActivate(): boolean {
    if (localStorage.getItem('user') !== null) {
      return true;
    }

    this.toastr.info('Necessário estar autenticado para acessar!');
    this.router.navigate(['/user/login']);
    return false;
  }

}
