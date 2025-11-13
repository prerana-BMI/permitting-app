import { Component, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { disableDebugTools } from '@angular/platform-browser';
import { Constants } from 'src/app/Models/Constants';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  UserData: any = null;
  AddUserForm!: FormGroup;
  Submitted : boolean= false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private fb: FormBuilder,
    private httpService: HttpService) {
    this.UserData = data?.Item;

  }

  ngOnInit() {
    this.AddUserForm = this.fb.group({
      ActiveStatus: [true , [Validators.required]],
      UserRole: ['' , [Validators.required]],
      UserName: ['' , [Validators.required , Validators.email]]

    });
    if (this.UserData != undefined) {
      this.SetData();
    }
  }
  SetData() {
    this.AddUserForm.patchValue({
      ActiveStatus: this.UserData.IsActive,
      UserRole: this.UserData.UserRole,
      UserName: this.UserData.UserName,
    })
    this.AddUserForm.controls['UserName'].disable();
  }

  clear() {
    this.dialogRef.close();
  }
  Submit() {
    if (this.AddUserForm.invalid) {
      this.Submitted = true;
      return
    }
    let param = {
      UserName: this.AddUserForm.controls['UserName'].value,
      UserRole: this.AddUserForm.controls['UserRole'].value,
      IsActive: this.AddUserForm.controls['ActiveStatus'].value,
      Id: this.UserData != undefined ? this.UserData.Id : 0
    }
    this.httpService.httpGetCall(Constants.SaveUser, param, true).subscribe((res: any) => {
      if (res["Success"]) {
        this.dialogRef.close(param);
      }
    })
  }
}
