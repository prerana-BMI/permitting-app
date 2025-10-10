import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {
private data : any;
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
   
}
