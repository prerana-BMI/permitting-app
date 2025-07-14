import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selected-permit',
  templateUrl: './selected-permit.component.html',
  styleUrls: ['./selected-permit.component.scss']
})
export class SelectedPermitComponent {
  permitCategories : Array<any> = [];
  constructor(public dialogRef: MatDialogRef<SelectedPermitComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
  )
  {
   let permitCategories = data.reduce((acc: any, item: any) => {
      const key = item.Category || 'Uncategorized';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: typeof data });
    this.permitCategories = Object.entries(permitCategories);
    this.permitCategories.forEach(a=>a.expanded = false);
  }
  ngOnInit()
  {
    
    this.permitCategories;
  }
searchTerm = '';

 

  toggleCategory(index: number): void {
  this.permitCategories.forEach((cat, i) => {
    cat.expanded = i === index ? !cat.expanded : false;
  });
}
clear() {
    this.dialogRef.close()
  }
}
