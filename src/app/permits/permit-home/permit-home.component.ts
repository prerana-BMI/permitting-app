import { Component, Input } from '@angular/core';
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
  selectedLocations: { City: string; State: string }[] = [];
  selectedStates:  Array<any> = [];
  selectedCities:  Array<any> = [];
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
    let city = this.SearchForm.controls['city'].value == "Unknown" || this.SearchForm.controls['city'].value == null ? "" : this.SearchForm.controls['city'].value;
    let state = this.SearchForm.controls['state'].value == "Unknown" || this.SearchForm.controls['state'].value == null ? "" : this.SearchForm.controls['state'].value;
    this.router.navigate(["permits/permitlist", state, city]);
  }

  handleCitySelected(Event : any) {
   const existing = this.selectedLocations.find(loc => loc.City === Event.City && loc.State === Event.State);
    const result = {
      City: Event.City,
      State: Event.State
    };
    if (!existing) {
      this.selectedLocations.push(result);
    }
    else if(Event.Selected == "N") {
     let idx = this.selectedLocations.findIndex(loc => loc.City === Event.City && loc.State === Event.State);
     if(idx == -1)
     {
      let idx1 = this.selectedLocations.findIndex(loc =>  loc.State === Event.State);
      this.selectedLocations.splice(idx1,1);
     }
      this.selectedLocations.splice(idx,1);
    }
    
    this.selectedStates = this.selectedLocations.filter(a => a.State && a.State != 'Unknown').filter((item, index, self) =>index === self.findIndex(t => t.State === item.State));
    this.selectedCities = this.selectedLocations.filter(a=>a.City != null && a.City != undefined && a.City != '' && a.City != 'Unknown');

  }

 removeState(state : any): void {
  let statelistIndex = this.selectedStates.findIndex(a=>a.State == state.State );
  let stateobjindex = this.selectedLocations.findIndex(a=>a.State == state.State );
  const updated = [...this.selectedLocations];
  updated.splice(stateobjindex, 1);
  this.selectedStates.splice(statelistIndex,1);
  this.selectedLocations = updated; 
}
removeCity(state : any)
{
 let citylistIndex = this.selectedCities.findIndex(a=>a.State == state.State  && a.City == state.City);
let cityobjindex = this.selectedLocations.findIndex(a=>a.State == state.State && a.City == state.City );
const updated = [...this.selectedLocations];
  updated.splice(cityobjindex, 1);
  this.selectedCities.splice(citylistIndex,1);
  this.selectedLocations = updated; 
}
}
