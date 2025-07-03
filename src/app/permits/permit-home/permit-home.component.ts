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
  isStateLoading : boolean= false;
  SearchForm! : FormGroup;
  typeaheadDebounce : number = 500;
  StateList : Array<any> = [];
  SelectedStateName : string = '';
 
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
    
  }
initializeTyopeAhead()
{
this.SearchForm.controls['city'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
         this.isCityLoading = true;
         let state = this.SearchForm.controls['state'].value;
        this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?City=${val.toLowerCase()}&State=${state.toLowerCase()}`,false,false).subscribe((res :any) => {
          if (res["Success"] ) {
            this.CityList = res["Data"];
          }
          this.isCityLoading = false;
        });
      }
    });
    this.SearchForm.controls['state'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
         this.isStateLoading = true;
        this.HttpService.httpGetCall(Constants.GetStateBySearchText+  val.toLowerCase(),false , false).subscribe((res :any) => {
          if (res["Success"]) {
            this.StateList = res["Data"];
          }
          this.isStateLoading = false;
        });
      }
    });
}
  

  CityTypeAheadDisplay(val: any) {
    let res = this.CityList.find(a => a.City == val);
    if (res != null) {
      return res.City;
    };
    return '';
  }

  StateTypeAheadDisplay(val: any) {
      this.SelectedStateName = '';
    let res = this.StateList.find(a => a.State == val);
    if (res != null) {
      this.SelectedStateName = res.State;
      return res.State
    }
    return ''
  }
  Search() {

    this.router.navigate(["permits/permitlist", this.SearchForm.controls['state'].value,this.SearchForm.controls['city'].value]);
  }
  handleCitySelected(Event: any) {
    this.CityList = [{ City: Event.City }];
    this.StateList = [{ State: Event.State }];
    this.SearchForm.patchValue({
      city: Event.City,
      state: Event.State
    })
  }
}
