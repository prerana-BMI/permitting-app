import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'
@Component({
  selector: 'app-my-permits',
  templateUrl: './my-permits.component.html',
  styleUrls: ['./my-permits.component.scss']
})
export class MyPermitsComponent {
  MatrixList: Array<any> = [];
  pageSize: number = 10;
  SelecAll: boolean = true;
  pageOption: any = Constants.PageSizeOptions.map(a=>a.value);
  pageIndex: number = 1;
  SearchForm!: FormGroup;
  dataCount: number = 0;
  ProgramList: Array<any> = [];
  ProgramId: number = 0;
  breadcrumbs: string[] = ['RFI', 'RFI List'];
  RegagencyList: Array<any> = [];
  isAgencyLoading: boolean = false;
  typeaheadDebounce: number = 500;
  messageSource = new BehaviorSubject<string>('0');
  isFilterOpened: boolean = false;
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {

  }
  ngOnInit() {
    this.SearchForm = this.fb.group({
      RegulatoryAgency: '',
      MatrixName: ''
    });
    this.GetAllMatrix();
    this.InitializedTypeAhead();
  }
  InitializedTypeAhead() {
    this.SearchForm.controls['RegulatoryAgency'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
        this.isAgencyLoading = true;
        this.httpService.httpGetCall(Constants.GetAllClientMaster + val.toLowerCase(), false, false).subscribe((res: any) => {
          if (res["Success"]) {

            this.RegagencyList = res["Data"];
          }
          this.isAgencyLoading = false;
        });
      }
    });
  }


  GetAllMatrix() {
    let param = {
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize,
      'ClientId': this.SearchForm.controls['RegulatoryAgency']?.value == null ? '' : this.SearchForm.controls['RegulatoryAgency']?.value,
      'MatrixName': this.SearchForm.controls['MatrixName']?.value == null ? '' : this.SearchForm.controls['MatrixName']?.value
    }
    this.httpService.httpGetCall(Constants.GetAllMatrix, param, true ).subscribe((res: any) => {
      if (res.Success) {
        this.MatrixList = res["Data"];
        this.dataCount = res["Count"];

      }
    });
  }
  paginatorevt(evt: any) {
    this.pageIndex = evt.pageIndex + 1;
    this.pageSize = evt.pageSize;

  }
  AgencyTypeAheadDisplay(val: any) {
    let res = this.RegagencyList.find(a => a.Name == val);
    if (res != null) {
      return res.Name;
    };
    return '';
  }
  Search() {
    this.GetAllMatrix();
  }

  Clear() {
    this.SearchForm.reset();
    this.GetAllMatrix();
  }
  ViewDetails(Id : number)
  {
    this.router.navigate(["/permits/MatrixDetails",Id]);
  }

  DeleteDetails(Id : number)
  {
      this.httpService.httpPostCall(Constants.DeleteMatrixDetailsById+Id, true).subscribe((res: any) => {
        if(res.Succeess)
        {
          this.GetAllMatrix();
        }
      })
  }


}
