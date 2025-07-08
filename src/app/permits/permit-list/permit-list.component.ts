import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateMatrixComponent } from '../create-matrix/create-matrix.component';
import * as XLSX from 'xlsx'
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
  CategoryList : Array<string> = [];
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
    private route: ActivatedRoute,
    private  HttpService : HttpService,
    private dialog: MatDialog,
  ) {
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
 this.GetMasterCategory();
 }

  GetMasterCategory() {
    this.HttpService.httpGetCall(Constants.CategoryList, false, false).subscribe((res: any) => {
      if (res["Success"]) {
        this.CategoryList = res["Data"]
      }
    })
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
    let param= {
      'State' : this.State,
      'City' : this.City,
      'Category' : this.SearchForm.controls['Category'].value == null ? '': this.SearchForm.controls['Category'].value,
      'PermitName': this.SearchForm.controls['PermitName'].value == null ? '': this.SearchForm.controls['PermitName'].value,
      'RegulatoryAgencyName': this.SearchForm.controls['RegulatoryAgency'].value == null ? '': this.SearchForm.controls['RegulatoryAgency'].value,
    }
    this.httpService.httpGetCall(Constants.GetPermitByLocation ,param, true).subscribe((res: any)=>{
      if (res["Success"]) {
        this.PermitList = res['Data'];
        this.dataCount = res['Count'];
        this.PermitList.forEach(a => {
          a.Ischecked = true
        });
      }
    })
  }
  CreateMatrix() {
    let dialogRef = this.dialog.open(CreateMatrixComponent, {
      data: this.PermitList.filter(a => a.Ischecked == true).map(a => a.Id)
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        this.GetAllPermits();
      }
    });
  }
  DownloadExcel()
  {
    let ExportData : Array<any> = [];
     let param= {
      'State' : this.State,
      'City' : this.City,
      'Category' : this.SearchForm.controls['Category'].value == null ? '': this.SearchForm.controls['Category'].value,
      'PermitName': this.SearchForm.controls['PermitName'].value == null ? '': this.SearchForm.controls['PermitName'].value,
      'RegulatoryAgencyName': this.SearchForm.controls['RegulatoryAgency'].value == null ? '': this.SearchForm.controls['RegulatoryAgency'].value,
    }
      this.httpService.httpGetCall(Constants.ExportPermitsToExcel ,param, true).subscribe((res: any)=>{
        if(res["Success"])
        {
         // this.ExportPermitList = res["Data"];
          res["Data"].forEach((a:any)=>
            ExportData.push({
              Category : a.Category,
                Permit_Name : a.PermitName,
                State : a.State,
                City : a.City,
                Level : a.Level,
                Regulatory_Agency_Name : a.RegulatoryAgencyName,
                Description : a.Description,
                Threshold : a.Threshold,
                Minimum_Preparation_Time : a.PrepTimeMin,
                Maximum_Preparation_Time: a.PrepTimeMax,
                Minimum_Agency_Review_Time : a.AgencyReviewTimeMin,
                Maximum_Agency_Review_Time : a.AgencyReviewTimeMax,
                Basic_Fees : a.BasicFees,
                   
        })
        );
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ExportData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
        XLSX.writeFile(wb, 'Permits.xlsx');
        }
      })
    
  }


}

