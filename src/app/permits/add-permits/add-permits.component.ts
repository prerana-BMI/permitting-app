import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { AuthService } from 'src/app/services/auth.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';
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
TypeofPermitList : Array<any> = [];
CategoryList : Array<string> = [];
isCountyLoading: boolean = false;
CountyList: any[] = [];
user : any = {};
 constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPermitsComponent>,
    private HttpService : HttpService,
    private dataTransferService : DatatransferService,
    private Auth : AuthService,
    private fb: FormBuilder) {
    this.PermitData = data;
    

  }
ngOnInit()
{
this.user = this.Auth.GetLoggedInUser();
this.GetMasterCategory();
this.GeAllMasterPermitType()

this.AddPermitForm= this.fb.group({
      Category: [''],
      TypeOfProject: [''],
      State: [''],
      County :[''],
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
  this.AddPermitForm.get('RegulatoryAgency')?.setValidators([
    this.dataTransferService.valueInListValidator(() => this.RegagencyList, 'Name')
  ]);

  this.AddPermitForm.get('State')?.setValidators([
    this.dataTransferService.valueInListValidator(() => this.StateList, 'State')
  ]);

  this.AddPermitForm.get('City')?.setValidators([
    this.dataTransferService.valueInListValidator(() => this.CityList, 'City')
  ]);
   this.AddPermitForm.get('County')?.setValidators([
    this.dataTransferService.valueInListValidator(() => this.CountyList, 'County')
  ]);

  this.initializeTyopeAhead();
  if (this.PermitData != null) {
    this.SetData();
  }
}

  async GetMasterCategory() {
    let res: any = await this.HttpService.httpGetCall(Constants.CategoryList, false, true).toPromise();
    if (res["Success"]) {
      this.CategoryList = res["Data"];
    }
  }
initializeTyopeAhead()
{
this.AddPermitForm.controls['City'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
  this.CityList = [];
      if (typeof val === 'string' && val.length >= 1) {
         this.isCityLoading = true;
          let state = this.AddPermitForm.controls['State'].value.toLowerCase();
          let county =this.AddPermitForm.controls['County'].value.toLowerCase();
         this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?State=${state}&County=${county}&City=${val.toLowerCase()}`,false,false).subscribe((res :any) => {
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
        this.HttpService.httpGetCall(Constants.GetStateBySearchText +  val.toLowerCase(),false , false).subscribe((res :any) => {
          if (res["Success"]) {

            this.StateList = res["Data"];
          }
          this.isStateLoading = false;
        });
      }
    });

    this.AddPermitForm.controls['County'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      const state = this.AddPermitForm.controls['State'].value??"".toLowerCase();
      if (typeof val === 'string' && val.length >= 1 && state) {
        this.isCountyLoading = true;
        this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?State=${state}&County=${val.toLowerCase()}`, false, false).subscribe((res: any) => {
          if (res?.Success) {
            this.CountyList = res.Data;
          }
          this.isCountyLoading = false;
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

  OnChanges(event: Event)
  {
    let val = (event.target as HTMLInputElement).value ; 
    if(val== "Federal")
    {
      this.AddPermitForm.controls['County'].disable();
      this.AddPermitForm.controls['State'].disable();
      this.AddPermitForm.controls['City'].disable();
    }
    else if(val == "State")
    {
      this.AddPermitForm.controls['State'].enable();
       this.AddPermitForm.controls['County'].disable();
     this.AddPermitForm.controls['City'].disable(); 
    }
    else if(val == "County")
    {
       this.AddPermitForm.controls['State'].enable();
        this.AddPermitForm.controls['County'].enable();
     this.AddPermitForm.controls['City'].disable(); 
    }
    else{
       this.AddPermitForm.controls['County'].enable();
     this.AddPermitForm.controls['City'].enable(); 
     this.AddPermitForm.controls['State'].enable(); 
    }
    
    
  }

SetData()
    {
      this.RegagencyList= [{Name : this.PermitData.RegulatoryAgencyName,Id : this.PermitData.RegulatoryAgencyId}];
      this.StateList = [{State : this.PermitData.State}];
      this.CityList = [{City : this.PermitData.City}];
      this.CountyList = [{County : this.PermitData.County}]
      this.AddPermitForm.patchValue ({
      Category : this.PermitData.Category,
      TypeOfProject: this.PermitData.TypeOfProject,
      AdditionalFees : this.PermitData.AdditionalBasic,
      State: this.PermitData.State,
      City: this.PermitData.City,
      County : this.PermitData.County,
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
      
      });
      if(this.user?.Role != 'Admin' && this.user?.Role != 'Editior')
      {
        this.AddPermitForm.disable()
      }
    }
  Submit() {
    let param = {
      Category: this.AddPermitForm.controls['Category'].value,
      TypeOfProject: this.AddPermitForm.controls['TypeOfProject'].value,
      State: this.AddPermitForm.controls['State'].value,
      City: this.AddPermitForm.controls['City'].value,
      County: this.AddPermitForm.controls['County'].value,
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
      Id: this.PermitData != null &&   this.PermitData != undefined ? this.PermitData.Id : 0,
      AdditionalBasic : this.AddPermitForm.controls['AdditionalFees'].value
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

  CountyTypeAheadDisplay(val: any) {
    let res = this.CountyList.find(a => a.County == val);
    if (res != null) {
      return res.County;
    }
    return ''
  }

// GeAllMasterPermitType()
// {
//   await this.HttpService.httpGetCall(Constants.GetMasterPermitType,false , false).subscribe((res :any) => {
//           if (res["Success"]) {

//             this.TypeofPermitList = res["Data"];
//           }
//         });
// }

async GeAllMasterPermitType()
{
 let res :any =  await this.HttpService.httpGetCall(Constants.GetMasterPermitType,false ,true).toPromise();
          if (res["Success"]) {

            this.TypeofPermitList = res["Data"];
          }
       
}
}
