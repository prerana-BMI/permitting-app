import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
PermitList : Array<any> = [{
    Permit : 'National Historic Preservation Act',
    RegulatoryAgency : 'efferson City, MO 65102',
    TimeFrame : '30-60 Days',
    ReviewTime : '90-180 Days',
    Fees : '$4210',
   
    Id : 1
  },
{
    Permit : 'National Historic Preservation Act',
    RegulatoryAgency : 'efferson City, MO 65102',
    TimeFrame : '30-60 Days',
    ReviewTime : '90-180 Days',
    Fees : '$4210',
    
    Id : 2
  }];
  pageSize: number = 10;
  SelecAll : boolean= true;
  pageOption: any;
  pageIndex: number = 1;
  SearchForm!: FormGroup;
  dataCount: number = 0;
  ProgramList: Array<any> = [];
  ProgramId: number = 0;
  breadcrumbs: string[] = ['RFI', 'RFI List'];
  messageSource = new BehaviorSubject<string>('0');
  isFilterOpened: boolean = false;
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private auth : AuthService,
    private dialog : MatDialog
  ) {

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      RfiNumber: '',
      RfiTitle: '',
      FpNumber: '',
      RfiQueryType: '',
      Status: ''
    });
    ;
 

  }


  paginatorevt(evt: any) {
    this.pageIndex = evt.pageIndex + 1;
    this.pageSize = evt.pageSize;
   
  }


  Search()
  {
   this.auth.getAccessToken('');
  }
  AddUser() {
    let dialogRef = this.dialog.open(AddUserComponent, {

    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
      }
    });
  }
  
}
