import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitListComponent } from './permit-list/permit-list.component';
import { PagesComponent } from '../pages/pages.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermitHomeComponent } from './permit-home/permit-home.component';
import { MaterialModule } from '../material/material.module';
import { MyPermitsComponent } from './my-permits/my-permits.component';
import { PermitMasterComponent } from './permit-master/permit-master.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: 'permitlist', component: PermitListComponent },
     { path: 'permithome', component: PermitHomeComponent },
     {path : 'MyPermits' , component : MyPermitsComponent},
     {path : 'PermitMasterList', component: PermitMasterComponent}
  ]
}];

@NgModule({
  declarations :[PermitListComponent , PermitHomeComponent, MyPermitsComponent],
  imports: [RouterModule.forChild(routes),
    ToastrModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [RouterModule]
})
export class PermitsRoutingModule { }
