import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-permit-home',
  templateUrl: './permit-home.component.html',
  styleUrls: ['./permit-home.component.scss']
})
export class PermitHomeComponent {
  CityList : Array<any> = [];
  isCityLoading : boolean= false;
  SearchForm! : FormGroup;
  typeaheadDebounce : number = 500;
  StateList : Array<any> = [];
 
  constructor(private Formbuilder : FormBuilder,
    private HttpService : HttpService,
    private router : Router
  )
  {

  }
ngOnInit()
{
  this.InitForm();
  this.initializeTyopeAhead();
}


  InitForm()
  {
    this.SearchForm = this.Formbuilder.group({
      city : [''],
      state : [''],
     
    });
    this.SearchForm.controls['state'].disable();
  }
initializeTyopeAhead()
{
this.SearchForm.controls['city'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
         this.isCityLoading = true;
        this.HttpService.httpGetThirdPartyCall('',  val.toLocaleLowerCase()).subscribe((res :any) => {
          if (res.length > 0) {
            this.CityList = res.filter((a : any)=>a.country == "US");
          }
          this.isCityLoading = false;
        });
      }
    });
}
  

  CityTypeAheadDisplay(val: any) {
  let res = this.CityList.find(a => a.name == val.name && a.state == val.state );
  if (res != null) {
    const state = res.state ?? '';
    const country = res.country ?? '';
    this.StateList = [{ state ,country}];
    this.SearchForm.patchValue({
      state : `${state} - ${country}`
    });

    return `${res.name} - ${state}`;
  }
  return '';
}
Search(){
  this.router.navigate(["permits/permitlist"])
}
}
