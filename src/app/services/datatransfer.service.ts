import { Injectable } from '@angular/core';
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
}
