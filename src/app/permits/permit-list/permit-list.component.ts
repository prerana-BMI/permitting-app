import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss']
})
export class PermitListComponent {
  City :string | null;
  State :string | null;
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
  PermitNameList :   Array<any> = [];
  ispermitLoading:  boolean = false;
  typeaheadDebounce : number = 500;
  isAgencyLoading: boolean = false;
  RegagencyList :  Array<any> = [];
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private auth : AuthService,
    private route: ActivatedRoute,
    private  HttpService : HttpService
  ) {
  debugger
  this.State = this.route.snapshot.paramMap.get('state');
  this.City= this.route.snapshot.paramMap.get('city');

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      Category: '',
      PermitName: '',
      RegulatoryAgency: ''
  });
 this.GetAllPermits();
 this.InitializedTypeAhead();
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
    this.PermitList = [];
    this.RegagencyList = [];
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
    
      this.PermitList.filter(a => a.Id == Id)[0].Ischecked = isChecked

    
  }
  InitializedTypeAhead()
  {
  this.SearchForm.controls['PermitName'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
        this.PermitNameList = [];
        if (typeof val === 'string' && val.length >= 1) {
           this.ispermitLoading = true;
          this.HttpService.httpGetCall(Constants.GetPermitNameBySearchText +  val.toLowerCase(),false , false).subscribe((res :any) => {
            if (res["Success"]) {
  
              this.PermitNameList = res["Data"];
            }
            this.ispermitLoading = false;
          });
        }
      });
         this.SearchForm.controls['RegulatoryAgency'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
     
      if (typeof val === 'string' && val.length >= 1) {
         this.isAgencyLoading = true;
        this.HttpService.httpGetCall(Constants.GetRegulatoryAgencyBySearchText+  val.toLowerCase(),false , false).subscribe((res :any) => {
          if (res["Success"]) {

            this.RegagencyList = res["Data"];
          }
          this.isAgencyLoading = false;
        });
      }
    });
  }
  PermitTypeAheadDisplay(val:string)
  {
    let res = this.PermitNameList.find(a => a.PermitName == val);
    if (res != null) {
      return res.PermitName;
    };
    return '';
  }

  AgencyTypeAheadDisplay(val: any)
  {
     let res = this.RegagencyList.find(a => a.Name == val);
    if (res != null) {
      return res.Name;
    };
    return '';
  }
  GetAllPermits()
  {
    debugger
    let param= {
      'State' : this.State,
      'City' : this.City,
      'Category' : this.SearchForm.controls['Category'].value == null ? '': this.SearchForm.controls['Category'].value,
       'PermitName': this.SearchForm.controls['PermitName'].value == null ? '': this.SearchForm.controls['PermitName'].value,
      'RegulatoryAgencyName': this.SearchForm.controls['RegulatoryAgency'].value == null ? '': this.SearchForm.controls['RegulatoryAgency'].value,
    }
    this.httpService.httpGetCall(Constants.GetPermitByLocation ,param, true) .subscribe((res: any)=>{
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

