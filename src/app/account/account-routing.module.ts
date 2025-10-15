import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersListComponent } from './users-list/users-list.component';
import { PagesComponent } from '../pages/pages.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AddUserComponent } from './add-user/add-user.component';
import { activeauthGuard } from '../guard/activeauth.guard';

const routes: Routes = [
  
  { path: 'login', component: LoginComponent , data: { allowAnonymous: true } },
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'UsersList', component: UsersListComponent,
        canActivate: [activeauthGuard]
      }
    ]
  }
 
    

];
@NgModule({
  declarations : [UsersListComponent, AddUserComponent],
  imports: [RouterModule.forChild(routes),
    ToastrModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
