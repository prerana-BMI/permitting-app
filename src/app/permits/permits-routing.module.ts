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
import { MapComponent } from './map/map.component';
import {AddPermitsComponent} from './add-permits/add-permits.component';
import { CreateMatrixComponent } from './create-matrix/create-matrix.component';
import { MatrixDetailsComponent } from './matrix-details/matrix-details.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {path: 'permitlist/:state/:city', component: PermitListComponent },
     { path: 'permithome', component: PermitHomeComponent },
     {path : 'MatrixList' , component : MyPermitsComponent},
     {path : 'PermitMasterList', component: PermitMasterComponent},
     {path : 'MatrixDetails/:id', component: MatrixDetailsComponent}
  ]
}];

@NgModule({
  declarations :[PermitListComponent , PermitHomeComponent, MyPermitsComponent,MapComponent , PermitMasterComponent ,
                 AddPermitsComponent ,CreateMatrixComponent,MatrixDetailsComponent],
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
