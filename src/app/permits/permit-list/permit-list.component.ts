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
  RfiList: Array<any> = [];
  pageSize: number = 10;
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
    private auth : AuthService
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
   // this.GetAllProgramList();

   // this.GetAllRfi();

  }
  GetAllRfi() {
    let param = {
      'RfiNo': this.SearchForm.controls['RfiNumber'].value == null || this.SearchForm.controls['RfiNumber'].value == "" ? "" : this.SearchForm.controls['RfiNumber'].value.substring(this.SearchForm.controls['RfiNumber'].value?.lastIndexOf('0') + 1),
      'FpNumber': this.SearchForm.controls['FpNumber'].value ?? "",
      'Title': this.SearchForm.controls['RfiTitle'].value ?? "",
      'Status': this.SearchForm.controls['Status'].value ?? "",
      'RfiQueryType': this.SearchForm.controls['RfiQueryType'].value ?? "",
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize,
      'ProgramId': this.ProgramId
    }
    this.httpService.httpGetCall('').subscribe((res: any) => {
      if (res['Success']) {
        this.RfiList = res["Data"];
        this.dataCount = res['Count'];
      }
    });
  }

  AddNewRfi() {
    let name = this.ProgramList.find(a => a.Id == this.ProgramId)?.ProgramName;
    // this.appService.setData({key : this.ProgramId, value : name } );
    this.router.navigate(['/rfi/RfiDetails', 0]);

  }
  EditRfi(RfiId: number) {
    let ProgramId = this.RfiList.find(a => a.RfiNo == RfiId)?.ProgramId;
    let name = this.ProgramList.find(a => a.Id == ProgramId)?.ProgramName;
    // this.appService.setData({key : ProgramId, value : name } );
    this.router.navigate(['/rfi/RfiDetails', RfiId]);

  }
  // Search() {
  //   this.GetAllRfi();
  // }
  clear() {
    this.ProgramId = 0;
    this.SearchForm.reset();
    this.GetAllRfi();
  }
  paginatorevt(evt: any) {
    this.pageIndex = evt.pageIndex + 1;
    this.pageSize = evt.pageSize;
    this.GetAllRfi();
  }

  GetAllProgramList() {
    this.httpService.httpGetCall('', {}, true).subscribe((res: any) => {
      this.ProgramList = res['Data'];
    }
    )
  }
  ChangeFilter() {
    this.isFilterOpened = !this.isFilterOpened;
  }
  Search()
  {
   this.auth.getAccessToken('');
  }
}

