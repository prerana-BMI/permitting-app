import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
constructor(  
  @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserComponent>)
    {
      
    }
    clear() {
    this.dialogRef.close();
    }
}
