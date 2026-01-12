import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { HttpService } from 'src/app/services/http.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
  CountyList : Array<any> = [];
  SelectedStateName : string = '';
  selectedLocations: { City: string; State: string; County?: string; Selected: string }[] = [];
  selectedStates:  Array<any> = [];
  selectedCities:  Array<any> = [];
   groupedLocationsByStates: { state: string, cities: string[] }[] = [];
RemovedLocation: any = {};
  isCountyLoading : boolean= false;
  constructor(private Formbuilder : FormBuilder,
    private HttpService : HttpService,
    private router : Router,
    private datatransferService : DatatransferService
  )
  {

  }
ngOnInit()
{
  this.InitForm();
  this.initializeTyopeAhead();
  this.SearchForm.get('state')?.setValidators([
    this.datatransferService.valueInListValidator(() => this.StateList, 'State')
  ]);

  this.SearchForm.get('city')?.setValidators([
    this.datatransferService.valueInListValidator(() => this.CityList, 'City')
  ]);
   
}


  InitForm()
  {
    this.SearchForm = this.Formbuilder.group({
      city : ['', []],
      state : ['',[]],
      county : ['',[]]
     
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

     this.SearchForm.controls['county'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
         this.isCountyLoading = true;
        this.HttpService.httpGetCall(Constants.GetStateBySearchText+  val.toLowerCase(),false , false).subscribe((res :any) => {
          if (res["Success"]) {
            this.CountyList = res["Data"];
          }
          this.isCountyLoading = false;
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
      return res.State;
    }
    return ''
  }

   CountyTypeAheadDisplay(val: any) {
    let res = this.CountyList.find(a => a.county == val);
    if (res != null) {
      return res.County;
    }
    return ''
  }
  
  Search() {
    let city = this.SearchForm.controls['city'].value == "Unknown" || this.SearchForm.controls['city'].value == null ? "" : this.SearchForm.controls['city'].value;
    let state = this.SearchForm.controls['state'].value == "Unknown" || this.SearchForm.controls['state'].value == null ? "" : this.SearchForm.controls['state'].value;
    this.datatransferService.setData({
      'data' : this.groupedLocationsByStates,
      'NavigatedFrom': 'Home'
    });
    this.router.navigate(["permits/PermitList"]);
  }
handleCitySelected(event: { City: string, State: string, County: string, Selected: 'Y' | 'N' }) {
  const existingIndex = this.selectedLocations.findIndex(
    loc => loc.City === event.City && loc.State === event.State
  );

  if (event.Selected === 'Y' && existingIndex === -1) {
    this.selectedLocations.push({ 
        City: event.City, 
        State: event.State, 
        County: event.County,
        Selected: 'Y'
      });
    
  } 
  else if(existingIndex !== -1 && event.State !== "" && event.City != "") {
    this.selectedLocations.splice(existingIndex, 1);
    }
  
  this.selectedLocations = [...this.selectedLocations];
  this.updateGroupedLocations();
}



AddToList() {

  this.SearchForm.get('state')?.updateValueAndValidity({ onlySelf: true });
  this.SearchForm.get('city')?.updateValueAndValidity({ onlySelf: true });

  this.SearchForm.markAllAsTouched();

  if (this.SearchForm.invalid) {
    if (this.SearchForm.get('state')?.hasError('notInList')) {
      return;
    }
    if (this.SearchForm.get('city')?.hasError('notInList')) {
     return;
    }
  }
  const city = this.SearchForm.controls['city'].value;
  let state = this.SearchForm.controls['state'].value;

  if (!state && !city) return;

  const matchedState = this.StateList.find(s => s.State.toUpperCase() === state.toUpperCase());
  if (matchedState) state = matchedState.State;

  if (state && (!city || city === '' || city === 'Unknown')) {
    this.addStateOnly(state);
    this.SearchForm.reset();
    return;
  }

  const existingStateIndex = this.selectedLocations.findIndex(
    loc => loc.State === state
  );

  if (existingStateIndex !== -1) {
    if (!this.selectedLocations.some(loc => loc.State === state && loc.City === city)) {
      this.selectedLocations.push({ City: city, State: state, Selected: 'Y' });
    }
  } else {
    this.selectedLocations.push({ City: city, State: state, Selected: 'Y' });
  }

  this.selectedLocations = [...this.selectedLocations]; 
  this.updateGroupedLocations();
  this.SearchForm.reset();
}


/**
 * Adds a state only (without city) to selectedLocations
 * Ensures child map highlights state boundaries
 */
addStateOnly(state: string) {
  const exists = this.selectedLocations.some(
    loc => loc.State === state && (!loc.City || loc.City === '')
  );
  if (!exists) {
    this.selectedLocations.push({ City: '', State: state, Selected: 'Y' });
    this.selectedLocations = [...this.selectedLocations]; 
    this.updateGroupedLocations();
  }
}


 
updateGroupedLocations() {
  const map = new Map<string, Set<string>>();

  for (const item of this.selectedLocations) {
    if (!item.State) continue;

    if (!map.has(item.State)) {
      map.set(item.State, new Set());
    }

    if (item.City && item.City !== 'Unknown') {
      map.get(item.State)!.add(item.City);
    }
  }

  this.groupedLocationsByStates = Array.from(map.entries()).map(([state, cities]) => ({
    state,
    cities: Array.from(cities)
  }));
}




removeCity(item: { City: string, State: string , Selected : string }) {
  
  const idx = this.selectedLocations.findIndex(
    loc => loc.City === item.City && loc.State === item.State
  );
  this.RemovedLocation = item;
  if (idx !== -1) {
    this.selectedLocations.splice(idx, 1);
    this.selectedLocations = [...this.selectedLocations]; 
    this.updateGroupedLocations();
  }
}

removeState(item: { State: string ,  Selected : string }) {
  this.RemovedLocation = item;
  this.selectedLocations = this.selectedLocations.filter(loc => loc.State !== item.State);
  this.selectedLocations = [...this.selectedLocations];
  this.updateGroupedLocations();
}



}
