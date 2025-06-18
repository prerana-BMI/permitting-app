import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss']
})
export class PermitListComponent {
 
  PermitList : Array<any> = [{
    Permit : 'National Historic Preservation Act',
    RegulatoryAgency : 'efferson City, MO 65102',
    TimeFrame : '30-60 Days',
    ReviewTime : '90-180 Days',
    Fees : '$4210',
    Ischecked : true ,
    Id : 1
  },
{
    Permit : 'National Historic Preservation Act',
    RegulatoryAgency : 'efferson City, MO 65102',
    TimeFrame : '30-60 Days',
    ReviewTime : '90-180 Days',
    Fees : '$4210',
    Ischecked : true ,
    Id : 2
  }];
  pageSize: number = 10;
  SelecAll : boolean= true;
  pageOption: any;
  pageIndex: number = 1;
  SearchForm!: FormGroup;
  dataCount: number = 2;
  ProgramList: Array<any> = [];
  ProgramId: number = 0;
  breadcrumbs: string[] = ['RFI', 'RFI List'];
  messageSource = new BehaviorSubject<string>('0');
  isFilterOpened: boolean = false;
  CategoryList = Constants.CategoryList;
  ClientList : Array<any> = [];
  RegulatoryAgencyList : Array<any> = [];
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private auth : AuthService
  ) {

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      Category: '',
      Client: '',
      RegulatoryAgency: ''
  });
 // this.GetAllPermits();
 }

paginatorevt(evt: any) {
    this.pageIndex = evt.pageIndex + 1;
    this.pageSize = evt.pageSize;
   
  }


  Search()
  {
   
    this.GetAllPermits();
  }
  Clear()
  {
    this.SearchForm.reset();
    this.GetAllPermits();
  }
  SelectAll(event: any) {
     const isChecked = (event.target as HTMLInputElement).checked;
    this.PermitList.forEach(a => {
      a.Ischecked =isChecked ?  true : false
    });
  }
  OnSingleChange(event: any, Id: number) : void  {
     const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.PermitList.filter(a => a.Id == Id)

    }
  }
  GetAllPermits()
  {
     let param= {
      '': this.SearchForm.controls['Category'].value== null || this.SearchForm.controls['Category'].value== "" ? '' :  this.SearchForm.controls['Category'].value,
      '':this.SearchForm.controls['Client'].value== null || this.SearchForm.controls['Client'].value== "" ? '' : this.SearchForm.controls['Client'].value,
      '':this.SearchForm.controls['RegulatoryAgency'].value == null || this.SearchForm.controls['RegulatoryAgency'].value =="" ? '' :  this.SearchForm.controls['RegulatoryAgency'].value
    }
    this.httpService.httpGetCall(Constants.CategoryList.toString(), param,true).subscribe((res: any)=>{
      if (res["Success"]) {
        this.PermitList = res['Data'];
        this.dataCount = res['Count'];
        this.PermitList.forEach(a => {
          a.Ischecked = true
        });
      }
    })
  }
  //this.GetAllPermits;
  //this.httpService.httpGetCall(Constants.CategoryList.toString(), null,true).sub
 


}

