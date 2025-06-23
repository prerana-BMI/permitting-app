
import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-permit-master',
  templateUrl: './permit-master.component.html',
  styleUrls: ['./permit-master.component.scss']
})
export class PermitMasterComponent {
 
  PermitList : Array<any> = [];
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
      PermitName: ''
    });
    this.GetAllPermits();
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


  GetAllPermits()
  {
     let param= {
      'Category' : this.SearchForm.controls['Category']?.value,
      'PermitName' : this.SearchForm.controls['PermitName']?.value
        }
    this.httpService.httpGetCall(Constants.GetAllMasterPermits.toString(), param,true).subscribe((res: any)=>{
      if (res["Success"]) {
        this.PermitList = res['Data'];
        this.dataCount = res['Count'];
       
      }
    })
  }
  //this.GetAllPermits;
  //this.httpService.httpGetCall(Constants.CategoryList.toString(), null,true).sub
 


}

