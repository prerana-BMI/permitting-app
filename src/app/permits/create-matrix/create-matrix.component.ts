import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-matrix',
  templateUrl: './create-matrix.component.html',
  styleUrls: ['./create-matrix.component.scss']
})
export class CreateMatrixComponent {
  AddMatrixForm! : FormGroup
  RegagencyList : Array<any> = [];
  isAgencyLoading : boolean= false;
typeaheadDebounce : number = 500;
CityList : Array<any> = [];
isCityLoading : boolean= false;
TypeofPermitList : Array<string>= [];
constructor(private fb : FormBuilder, private HttpService : HttpService)
{

}
  ngOnInit()
  {
    this.AddMatrixForm = this.fb.group({
      TypeOfProject : '',
      RegulatoryAgency :'',
      MatrixName : ''

    });
    this.InitializedTypeAhead();
    this.GeAllMasterPermitType()
  }
Submit()
{

}
clear()
{

}
GeAllMasterPermitType()
{
   this.HttpService.httpGetCall(Constants.GetMasterPermitType,false , false).subscribe((res :any) => {
          if (res["Success"]) {

            this.TypeofPermitList = res["Data"];
          }
        });
}
InitializedTypeAhead(){


this.AddMatrixForm.controls['RegulatoryAgency'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
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
AgencyTypeAheadDisplay(val: any)
  {
     let res = this.RegagencyList.find(a => a.Name == val);
    if (res != null) {
      return res.Name;
    };
    return '';
  }

}
