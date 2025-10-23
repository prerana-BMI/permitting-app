
import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from 'src/app/account/add-user/add-user.component';
import { AddPermitsComponent } from '../add-permits/add-permits.component';
@Component({
  selector: 'app-permit-master',
  templateUrl: './permit-master.component.html',
  styleUrls: ['./permit-master.component.scss']
})
export class PermitMasterComponent {
 
  PermitList : Array<any> = [];
  pageSize: number = 10;
  SelecAll : boolean= true;
  pageOption: any = Constants.PageSizeOptions.map(a=>a.value);
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
  PermitData : any ;
  PermitNameList : Array<any> = []; 
  ispermitLoading : boolean =false;
  typeaheadDebounce : number = 500;
  user : any = {};
  constructor(private httpService: HttpService,
    public router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private HttpService : HttpService,
    private Auth : AuthService
  ) {

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      Category: '',
      PermitName: ''
    });
    this.user = this.Auth.GetLoggedInUser();
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
    })
}
paginatorevt(evt: any) {
    this.pageIndex = evt.pageIndex + 1;
    this.pageSize = evt.pageSize;
    this.GetAllPermits();
   
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
    let param = {
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize,
      'Category': this.SearchForm.controls['Category']?.value == null ? '' : this.SearchForm.controls['Category']?.value,
      'PermitName': this.SearchForm.controls['PermitName']?.value == null ? '' : this.SearchForm.controls['PermitName']?.value
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
 
AddPermit()
{
  
  let dialogRef = this.dialog.open(AddPermitsComponent, {
        data: null,
         width: '1000px',          // ✅ Fixed width
        
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != null) {
          this.GetAllPermits();
        }
      });
}

  EditPermit(Id: number) {
    this.httpService.httpGetCall(`${Constants.GetPermitById}?PermitId=${Id}`, true).subscribe((res: any) => {
      if (res["Success"]) {
      let dialogRef = this.dialog.open(AddPermitsComponent, {
          data: res["Data"],
           width: '1000px',          // ✅ Fixed width
          
        });
        dialogRef.afterClosed().subscribe(resdata => {
          if (resdata != null) {
            this.GetAllPermits();
          }
        });
      }
    })
  }

  PermitTypeAheadDisplay(val:string)
  {
    let res = this.PermitNameList.find(a => a.PermitName == val);
    if (res != null) {
      return res.PermitName;
    };
    return '';
  }

}

