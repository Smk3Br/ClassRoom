import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocosComponent } from './components/blocos/blocos.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  { path: 'blocos', component: BlocosComponent },
  { path: 'aulas', component: AulasComponent },
  { path: 'contatos', component: ContatosComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
