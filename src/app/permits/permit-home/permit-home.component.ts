import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { DatatransferService } from 'src/app/services/datatransfer.service';
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
   groupedLocationsByStates: { state: string, cities: string[] }[] = [];
RemovedLocation: any = {};
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
    this.datatransferService.setData({
      'data' : this.groupedLocationsByStates,
      'NavigatedFrom': 'Home'
    });
    this.router.navigate(["permits/permitlist"]);
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
    else if(Event.Selected =="N"){
    
       if(Event.City == "Unknown")
       {

    this.selectedLocations = this.selectedLocations.filter(loc => loc.State !== Event.State);
     }
    
    else{
      var selectedLocations = this.selectedLocations.findIndex(loc => loc.State == Event.State && loc.City == Event.City );
     this.selectedLocations.splice(selectedLocations,1);
    }
     
  }
  this.updateGroupedLocations()
 
  }


  AddToList() {
    const result = {
      City: this.SearchForm.controls['city'].value,
      State: this.SearchForm.controls['state'].value,
      Selected : 'Y'
    };
     const existingloc = this.selectedLocations.find(loc => loc.State === this.SearchForm.controls['state'].value  && loc.City == this.SearchForm.controls['city'].value );
      if (!existingloc) {
         this.RemovedLocation = result;
        this.selectedLocations.push(result);
        this.selectedLocations = [...this.selectedLocations]; // 👈 Force reference update
        this.updateGroupedLocations();
      }
    
   this.SearchForm.reset();
    
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
  this.RemovedLocation = item;;
  this.selectedLocations = this.selectedLocations.filter(loc => loc.State !== item.State);
  this.selectedLocations = [...this.selectedLocations]; // 👈 Force reference update
  this.updateGroupedLocations();
}




}
