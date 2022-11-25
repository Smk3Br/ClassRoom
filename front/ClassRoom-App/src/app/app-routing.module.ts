import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocosComponent } from './components/blocos/blocos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { BlocoDetalheComponent } from './components/blocos/bloco-detalhe/bloco-detalhe.component';
import { BlocoListaComponent } from './components/blocos/bloco-lista/bloco-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil' },
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
      { path: 'dashboard', component: DashboardComponent}
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent}
    ]
  },
  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
