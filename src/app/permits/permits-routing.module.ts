import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitListComponent } from './permit-list/permit-list.component';
import { PagesComponent } from '../pages/pages.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermitHomeComponent } from './permit-home/permit-home.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'permitlist', component: PermitListComponent },
     { path: 'permithome', component: PermitHomeComponent }
  ]
}];

@NgModule({
  declarations :[PermitListComponent , PermitHomeComponent],
  imports: [RouterModule.forChild(routes),
    ToastrModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class PermitsRoutingModule { }
