import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-permits',
  templateUrl: './add-permits.component.html',
  styleUrls: ['./add-permits.component.scss']
})
export class AddPermitsComponent {
AddPermitForm! : FormGroup;
UserData : any;
StateList : Array<any> = [];
isStateLoading : boolean= false;
isAgencyLoading : boolean= false;
typeaheadDebounce : number = 500;
CityList : Array<any> = [];
RegagencyList : Array<any> = [];
isCityLoading : boolean= false;
 PermitData : any; 
CategoryList : Array<string> = [];
user : any = {};
 constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPermitsComponent>,
    private HttpService : HttpService,
    private Auth : AuthService,
    private fb: FormBuilder) {
    this.PermitData = data;
    

  }
ngOnInit()
{
this.GetMasterCategory();
this.user = this.Auth.GetLoggedInUser();
this.AddPermitForm= this.fb.group({
      Category: [''],
      TypeOfProject: [''],
      State: [''],
      City: [''],
      Level: [''],
      PermitName: [''],
      RegulatoryAgency: [''],
      Description: [''],
      Threshold: [''],
      MinPrepTime: [''],
      MaxPrepTime: [''],
      MinAgencyReviewTime: [''],
      MaxAgencyReviewTime: [''],
      BasicFees: [''],
      AdditionalFees: ['']
    });
    this.initializeTyopeAhead();
  if (this.PermitData != null) {
    this.SetData();
  }
}
  GetMasterCategory() {
    this.HttpService.httpGetCall(Constants.CategoryList, false, false).subscribe((res: any) => {
      if (res["Success"]) {
        this.CategoryList = res["Data"]
      }
    })
  }
initializeTyopeAhead()
{
this.AddPermitForm.controls['City'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
  this.CityList = [];
      if (typeof val === 'string' && val.length >= 1) {
         this.isCityLoading = true;
          let state = this.AddPermitForm.controls['State'].value;
         this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?City=${val.toLowerCase()}&State=${state.toLowerCase()}`,false,false).subscribe((res :any) => {
          if (res["Success"] ) {
            this.CityList = res["Data"];
          }
          this.isCityLoading = false;
        });
      }
    });
    this.AddPermitForm.controls['State'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      this.StateList = [];
      if (typeof val === 'string' && val.length >= 1) {
         this.isStateLoading = true;
        this.HttpService.httpGetCall(Constants.GetStateBySearchText+  val.toLowerCase(),false , false).subscribe((res :any) => {
          if (res["Success"]) {

            this.StateList = res["Data"];
          }
          this.isStateLoading = false;
        });
      }
    });

     this.AddPermitForm.controls['RegulatoryAgency'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      this.StateList = [];
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

SetData()
    {
      this.RegagencyList= [{Name : this.PermitData.RegulatoryAgencyName,Id : this.PermitData.RegulatoryAgencyId}];
      this.StateList = [{State : this.PermitData.State}];
      this.CityList = [{City : this.PermitData.City}];
      this.AddPermitForm.patchValue ({
      Category : this.PermitData.Category,
      TypeOfProject: this.PermitData.TypeOfProject,
     
      State: this.PermitData.State,
      City: this.PermitData.City,
      Level:  this.PermitData.Level,
      PermitName: this.PermitData.PermitName,
      RegulatoryAgency: this.PermitData.RegulatoryAgencyName,
      Description: this.PermitData.Description,
      Threshold: this.PermitData.Threshold,
      MinPrepTime: this.PermitData.PrepTimeMin,
      MaxPrepTime: this.PermitData.PrepTimeMax,
      MinAgencyReviewTime: this.PermitData.AgencyReviewTimeMin,
      MaxAgencyReviewTime: this.PermitData.AgencyReviewTimeMax,
      BasicFees: this.PermitData.BasicFees,
      AdditionalFees: this.PermitData.PermitName
      });
    }
  Submit() {
    let param = {
      Category: this.AddPermitForm.controls['Category'].value,
      TypeOfProject: this.AddPermitForm.controls['TypeOfProject'].value,
      State: this.AddPermitForm.controls['State'].value,
      City: this.AddPermitForm.controls['City'].value,
      Level: this.AddPermitForm.controls['Level'].value,
      PermitName: this.AddPermitForm.controls['PermitName'].value,
      RegulatoryAgencyName: this.AddPermitForm.controls['RegulatoryAgency'].value,
      RegulatoryAgencyId : this.RegagencyList.find(a=>a.Name == this.AddPermitForm.controls['RegulatoryAgency'].value)?.Id,
      Description: this.AddPermitForm.controls['Description'].value,
      Threshold: this.AddPermitForm.controls['Threshold'].value,
      PrepTimeMin: this.AddPermitForm.controls['MinPrepTime'].value,
      PrepTimeMax: this.AddPermitForm.controls['MaxPrepTime'].value,
      AgencyReviewTimeMin: this.AddPermitForm.controls['MinAgencyReviewTime'].value,
      AgencyReviewTimeMax: this.AddPermitForm.controls['MaxAgencyReviewTime'].value,
      BasicFees: this.AddPermitForm.controls['BasicFees'].value,
      Id: this.PermitData != null &&   this.PermitData != undefined ? this.PermitData.Id : 0
    }
    this.HttpService.httpPostCall(Constants.SavePermits, param, true).subscribe((res: any) => {
      if (res["Success"]) {
        this.dialogRef.close(param)

      }
    })
  }
clear()
{
  this.dialogRef.close();
}
 StateTypeAheadDisplay(val: any) {
    let res = this.StateList.find(a => a.State == val);
    if (res != null) {
      return res.State;
    }
    return ''
  }
    CityTypeAheadDisplay(val: any) {
    let res = this.CityList.find(a => a.City == val);
    if (res != null) {
      return res.City;
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
}
