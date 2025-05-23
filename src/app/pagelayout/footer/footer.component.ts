import { Component } from '@angular/core';
//import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
 
})
export class FooterComponent {
  //newFormGroup!  : FormGroup;
  constructor(
    //private fb: FormBuilder

  ){

  }
  liistodCategory : Array<any> = [];
  ngOnInit()
  {
    this.liistodCategory = [
      {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'Permit List',
    icon: 'grid-outline',
    link : '/pages/dashboard'
  },
    ];
  }
  // initForm (){
  //   this.newFormGroup = this.fb.group({
  //     id : [ {value : '' , [Validators.required, Validators.pattern] }] 
  //   })
  // }
  
}

