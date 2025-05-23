import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitListComponent } from './permit-list/permit-list.component';
import { PagesComponent } from '../pages/pages.component';
import { ToastrModule } from 'ngx-toastr';


const routes: Routes = [{ path: '',
  component: PagesComponent,
  children:[
  {path:'permitlist',component : PermitListComponent}
]
}];

@NgModule({
  declarations :[PermitListComponent],
  imports: [RouterModule.forChild(routes),
    ToastrModule
  ],
  exports: [RouterModule]
})
export class PermitsRoutingModule { }
