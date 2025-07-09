import { Component  } from '@angular/core';
import {  Location } from '@angular/common';
//import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
 
})
export class FooterComponent {
 constructor(private location : Location){
  
  }
  liistodCategory : Array<any> = [];
  ngOnInit()
  {
    
  }
  back()
  {
    this.location.back()
  }
  
}

