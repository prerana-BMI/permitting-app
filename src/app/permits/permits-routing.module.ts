import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitListComponent } from './permit-list/permit-list.component';
import { PagesComponent } from '../pages/pages.component';


const routes: Routes = [{ path: '',
  component: PagesComponent,
  children:[
  {path:'permitlist',component : PermitListComponent}
]
}];

@NgModule({
  declarations :[PermitListComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermitsRoutingModule { }
