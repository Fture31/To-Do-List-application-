import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './COMPONENTES/list/list.component';
import { AddComponent } from './COMPONENTES/add/add.component';
import { UpdateComponent } from './COMPONENTES/update/update.component';
import { UserComponent } from './COMPONENTES/user/user.component';
const routes: Routes = [
  { path:'listall', redirectTo:'/list', pathMatch:'full'},
  {path:'list' , component: ListComponent},
  {path:'add', component:AddComponent},
  {path:'edit/:id', component:UpdateComponent},
  { path: '', component: UserComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
