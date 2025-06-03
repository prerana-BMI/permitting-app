// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoaderService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public count: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  display(value: boolean) {
     
      value ? this.count.next(this.count.getValue() + 1) : this.count.next(this.count.getValue() - 1);
      if(this.count.getValue() < 1 || value)
      {
           this.status.next(value);
      }
  }
  constructor() { }
}
