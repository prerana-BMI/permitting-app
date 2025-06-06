import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import {   MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDialogModule
  ],
   exports: [
  
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDialogModule
   
    
  ]
})
export class MaterialModule { }
