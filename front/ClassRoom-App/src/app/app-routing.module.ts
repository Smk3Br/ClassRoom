import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocosComponent } from './components/blocos/blocos.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { BlocoDetalheComponent } from './components/blocos/bloco-detalhe/bloco-detalhe.component';
import { BlocoListaComponent } from './components/blocos/bloco-lista/bloco-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';

const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent}
    ]
  },
  {
    path: 'user/perfil', component: PerfilComponent
  },
  { path: 'blocos', redirectTo: 'blocos/lista' },
  { path: 'blocos', component: BlocosComponent, children: [
      { path: 'detalhe/:id', component: BlocoDetalheComponent },
      { path: 'detalhe', component: BlocoDetalheComponent },
      { path: 'lista', component: BlocoListaComponent }
    ]
  },
  { path: 'aulas', component: AulasComponent },
  { path: 'contatos', component: ContatosComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
