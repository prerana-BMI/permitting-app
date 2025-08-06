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
import { SelectedPermitComponent } from '../selected-permit/selected-permit.component';
import { DatatransferService } from 'src/app/services/datatransfer.service';
@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss']
})
export class PermitListComponent {
  City : string  = '' ;
  Level : string = 'All';
  LevelList : string[] = ["All","Federal","State","City"];
  State : string = '';
  PermitList : Array<any> = [];
  pageSize: number = 10;
  SelecAll : boolean= false;
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
  CityList : Array<any> = [];
  isCityLoading : boolean= false;
  ListOfId : Array<any> = [];
  StateList : Array<any> = [];
 
  SelectedCount : number = 0 ;
  NavigatedData  : any;
  StateCityMapping : {State : string , City : string}[]= [];
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private  HttpService : HttpService,
    private dialog: MatDialog,
    private Router : Router,
    private datatransferService : DatatransferService,
     
  ) {
  

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      Category: '',
      PermitName: '',
      RegulatoryAgency: ''
    });
    let res = this.datatransferService.getData();
    if (res != null && res['NavigatedFrom'] == 'Matrix') {
      this.datatransferService.setData(null);
      this.NavigatedData = res;
      this.ListOfId = this.NavigatedData?.data;
      this.SelectedCount = this.NavigatedData?.data?.length;
    }
    if(res != null && res.NavigatedFrom == 'Home')
    {
      this.datatransferService.setData(null);
      res.data.forEach((item: any) => {
        item.cities.forEach((element: any) => {
          this.StateCityMapping.push({ State: item.state, City: element });
        });
      });
      this.StateList =  [...new Set(this.StateCityMapping.map(a => a.State))];
    }

 this.GetAllPermits();
 //this.GetAllFederalPermits();
 this.InitializedTypeAhead();
 this.GetMasterCategory();

 }

  GetMasterCategory() {
    this.HttpService.httpGetCall(Constants.CategoryList, false, true).subscribe((res: any) => {
      if (res["Success"]) {
        this.CategoryList = res["Data"];
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
    this.RegagencyList = [];
    this.GetAllPermits();
  }
  getSelectedCount(): number {
    return this.SelectedCount = this.PermitList?.filter(item => item.Ischecked)?.length || 0;
  }
  SelectAll(event: any) {
     const isChecked = (event.target as HTMLInputElement).checked;
    this.PermitList.forEach(a => {
      a.Ischecked = isChecked ?  true : false
    });

    this.ListOfId = this.PermitList.filter(a=>a.Ischecked == true ).map(a=>a.Id);
    this.getSelectedCount();
  }
  OnSingleChange(event: any, Id: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.PermitList.filter(a => a.Id == Id)[0].Ischecked = isChecked;
    let idx = this.ListOfId.findIndex(x=>x ==Id);
    if (isChecked) {
      this.ListOfId.push(Id);
    }
    else if(idx != -1)
    {
     
      this.ListOfId.splice(idx,1)
    }
      this.getSelectedCount();
  }
  InitializedTypeAhead()
  {
    this.SearchForm.controls['PermitName'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      this.PermitNameList = [];
      if (typeof val === 'string' && val.length >= 1) {
        this.ispermitLoading = true;
        this.HttpService.httpGetCall(Constants.GetPermitNameBySearchText + val.toLowerCase(), false, false).subscribe((res: any) => {
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
        this.HttpService.httpGetCall(Constants.GetRegulatoryAgencyBySearchText + val.toLowerCase(), false, false).subscribe((res: any) => {
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
      'Level' : this.Level,
      'State' :  (this.Level == 'State' || this.Level == 'City') && this.State != '' ? [this.State] : [...new Set(this.StateCityMapping.map(a => a.State))],
      'City' :   this.Level == "State" && this.City == "" ? [] : this.City != '' ? [this.City] : [...new Set(this.StateCityMapping.map(a => a.City))],
      'Category' : this.SearchForm.controls['Category'].value == null ? '': this.SearchForm.controls['Category'].value,
      'PermitName': this.SearchForm.controls['PermitName'].value == null ? '': this.SearchForm.controls['PermitName'].value,
      'RegulatoryAgencyName': this.SearchForm.controls['RegulatoryAgency'].value == null ? '': this.SearchForm.controls['RegulatoryAgency'].value,

    }
    this.httpService.httpGetCall(Constants.GetPermitByLocation ,param, true).subscribe((res: any)=>{
      if (res["Success"]) {
        this.PermitList = res['Data'];
      
        this.dataCount = res['Count'];
      }
    })
  }
  GetAllFederalPermits()
  {
    let param= {
      'Category' : this.SearchForm.controls['Category'].value == null ? '': this.SearchForm.controls['Category'].value,
      'PermitName': this.SearchForm.controls['PermitName'].value == null ? '': this.SearchForm.controls['PermitName'].value,
      'RegulatoryAgencyName': this.SearchForm.controls['RegulatoryAgency'].value == null ? '': this.SearchForm.controls['RegulatoryAgency'].value,
    }
    this.httpService.httpGetCall(Constants.GetAllFederalPermits ,param, true).subscribe((res: any)=>{
      if (res["Success"]) {
        this.PermitList = res['Data'];
        this.PermitList.forEach(element => {
          let isItemExist = this.ListOfId?.find(a => a == element.Id) ? true : false;
          element.Ischecked = isItemExist;
        });
        this.dataCount = res['Count'];
      }
    })
  }
CreateMatrix(): void {
  if (this.SelectedCount == 0) {
    this.toastr.error("Please Select Applicable Permits");
    return;
  }

  if (this.NavigatedData != null) {
    let param = {
      Id: this.NavigatedData.MatrixId,
      PermitList: this.PermitList.filter(a => a.Ischecked == true).map(a => a.Id).join(',')
    };
    this.HttpService.httpPostCall(Constants.SavePermitMatrix, param).subscribe((res: any) => {
      if (res["Success"]) {
        this.Router.navigate(["/permits/MatrixList"]);
      }
    });
    return;
  }

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
   CityTypeAheadDisplay(val: any) {
    let res = this.CityList.find(a => a == val);
     if (res != null) {
       return res;
     }
   
  }
  LevelTypeAheadDisplay(val: any) {
    let res = this.LevelList.find(a => a == val);
     if (res != null) {
       return res;
     }
   return'';
  }

  OnValueChanges() {
    this.isCityLoading = true;
    this.CityList =[];
    this.PermitList =[];
    this.ListOfId = [];
    this.SelectedCount = 0;
    if (this.City) {
      this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?City=${this.City ?? "".toLowerCase()}&State=${this.State ?? "".toLowerCase()}`, false, false).subscribe((res: any) => {
        if (res["Success"]) {
          this.CityList = res["Data"];
        }
        this.isCityLoading = false;
      });
    }
    else {
      this.GetAllPermits();
    }
  }
  ViewDetails()
  {
    let dialogRef = this.dialog.open(SelectedPermitComponent, {
      data: this.PermitList.filter(a=>a.Ischecked == true),
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
       this.PermitList.forEach(a=>{
        a.Ischecked = res.find((b : any)=> b ==a.Id) ? false : a.Ischecked
       });
       this.SelectedCount = this.PermitList?.filter(item => item.Ischecked)?.length
      }
    });
  }
  StateTypeAheadDisplay(val : string)
  {
     let res = this.StateList.find(a => a == val);
     if (res != null) {
       this.CityList = this.StateCityMapping.filter(c=>c.State == val).map(a=>a.City);
       this.City = '';
        return res;
     }
   return'';
  }

  OnLevelChanges(event: string) {
    this.City = "";
    this.State = "";
    this.GetAllPermits();

  }
}

