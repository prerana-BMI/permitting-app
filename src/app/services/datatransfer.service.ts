import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {
private data : any;
 sortColumn: string = '';
 sortDirection: 'asc' | 'desc' = 'asc';
  setData(data: any) {
    this.data = data;
  }
  getData() {
    return this.data
  }
  constructor() {
   }

     valueInListValidator(listGetter: () => any[], key: string): ValidatorFn {
     return (control: AbstractControl): ValidationErrors | null => {
       const value = control.value;
       const list = listGetter();
   
       // ignore validation if no list yet
       if (!value) return null;
       if (!list || list.length === 0) return { notInList: true };
   
       // allow both string and object cases
       const exists = list.some(item => {
         if (typeof item === 'string') return item === value;
         if (item && typeof item === 'object') return item[key] === value;
         return false;
       });
   
       return exists ? null : { notInList: true };
     };
   }

    sortData(column: string , list : Array<any>) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    list.sort((a : any, b : any) => {
      const valA = a[column] || '';
      const valB = b[column] || '';

      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

   getSortIcon(column: string) {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

   
}
