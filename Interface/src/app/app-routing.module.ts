import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AjoutComponent } from './COMPONENTES/ajout/ajout.component';

import { ListComponent } from './COMPONENTES/list/list.component';
import { UpdateComponent } from './COMPONENTES/update/update.component';

const routes: Routes = [
  { path:'', redirectTo:'/list', pathMatch:'full'},
  {path:'list' , component: ListComponent},
  {path:'add', component:AjoutComponent},
  {path:'edit/:id', component:UpdateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
