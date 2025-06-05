import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule
    
  ],
   exports: [
  
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule
   
    
  ]
})
export class MaterialModule { }
