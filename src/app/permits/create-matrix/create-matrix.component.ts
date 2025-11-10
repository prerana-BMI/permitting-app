import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
SelectedPermit : Array<number> = [];
Submitted : boolean= false;
TypeofPermitList : Array<string>= [];
  constructor(private fb: FormBuilder, 
    private HttpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateMatrixComponent>,
    private Router : Router
  ) {
    this.SelectedPermit = this.data;
  }
  ngOnInit()
  {
    this.AddMatrixForm = this.fb.group({
      TypeOfProject : '',
      RegulatoryAgency :'',
      MatrixName : ['', [Validators.required]]

    });
    this.InitializedTypeAhead();
    this.GeAllMasterPermitType()
  }
  Submit() {
    if (this.AddMatrixForm.invalid) {
      this.Submitted = true;
      return
    }
    let param = {
      TypeOfProject: this.AddMatrixForm.controls['TypeOfProject'].value,
      ClientName: this.AddMatrixForm.controls['RegulatoryAgency'].value,
      MatrixName: this.AddMatrixForm.controls['MatrixName'].value,
      PermitList: this.SelectedPermit.join(',')

    };
    this.HttpService.httpPostCall(Constants.SavePermitMatrix, param).subscribe((res: any) => {
      if (res.Success) {
        this.dialogRef.close();
      this.Router.navigate(["/permits/MatrixList"]);
      }
     
    });

  }
clear()
{
this.dialogRef.close();
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
        this.HttpService.httpGetCall(Constants.GetAllClientMaster+  val.toLowerCase(),false , false).subscribe((res :any) => {
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
