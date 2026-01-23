import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Constants } from 'src/app/Models/Constants';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { HttpService } from 'src/app/services/http.service';

// --- INTERFACES FOR HIERARCHICAL DATA ---

// This represents a single location entry, which can be a state, county, or city.
export interface Location {
  State: string;
  County: string;
  City: string;
  Selected: 'Y' | 'N';
}

// This is the structure for the final grouped data used in the template.
export interface GroupedByState {
  state: string;
  isStateOnly: boolean;
  counties: GroupedByCounty[];
}

export interface GroupedByCounty {
  county: string;
  isCountyOnly: boolean;
  cities: Location[];
}


@Component({
  selector: 'app-permit-home',
  templateUrl: './permit-home.component.html',
  styleUrls: ['./permit-home.component.scss']
})
export class PermitHomeComponent implements OnInit {
  // --- Form & Autocomplete ---
  CityList: any[] = [];
  isCityLoading: boolean = false;
  isStateLoading: boolean = false;
  isCountyLoading: boolean = false;
  SearchForm!: FormGroup;
  typeaheadDebounce: number = 500;
  StateList: any[] = [];
  CountyList: any[] = [];

  // --- Selection Data ---
  selectedLocations: Location[] = [];
  groupedLocations: GroupedByState[] = []; // This replaces groupedLocationsByStates
  RemovedLocation: any = {};

  constructor(
    private Formbuilder: FormBuilder,
    private HttpService: HttpService,
    private router: Router,
    private datatransferService: DatatransferService
  ) { }

  ngOnInit() {
    this.InitForm();
    this.initializeTyopeAhead(); // Corrected spelling
    this.SearchForm.get('state')?.setValidators([
      this.datatransferService.valueInListValidator(() => this.StateList, 'State')
    ]);
  }

  InitForm() {
    this.SearchForm = this.Formbuilder.group({
      state: [null],
      county: [null], // Add county field
      city: [null],
    });
  }

  initializeTyopeAhead() {
    // State Typeahead
    this.SearchForm.controls['state'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      if (typeof val === 'string' && val.length >= 1) {
        this.isStateLoading = true;
        this.HttpService.httpGetCall(Constants.GetStateBySearchText + val.toLowerCase(), false, false).subscribe((res: any) => {
          if (res["Success"]) {
            this.StateList = res["Data"];
          }
          this.isStateLoading = false;
        });
      }
    });

    // County Typeahead
    this.SearchForm.controls['county'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      const state = this.SearchForm.controls['state'].value;
      if (typeof val === 'string' && val.length >= 1 && state) {
        
        this.isCountyLoading = true;
        this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?State=${state.toLowerCase()}&County=${val.toLowerCase()}&City=`, false, false).subscribe((res: any) => {
          if (res?.Success) {
            const map = new Map<string, any>();
            res.Data.forEach((item: any) => {
              if (!map.has(item.County)) {
                map.set(item.County, item);
              }
            });
            this.CountyList = Array.from(map.values());
          }
          this.isCountyLoading = false;
        });
      }
    });

    // City Typeahead
    this.SearchForm.controls['city'].valueChanges.pipe(debounceTime(this.typeaheadDebounce)).subscribe(val => {
      const state = this.SearchForm.controls['state'].value;
      const county = this.SearchForm.controls['county'].value;
      if (typeof val === 'string' && val.length >= 1 && state && county) {
        this.isCityLoading = true;
        this.HttpService.httpGetCall(`${Constants.GetCityBySearchText}?State=${state.toLowerCase()}&County=${county.toLowerCase()}&City=${val.toLowerCase()}`, false, false).subscribe((res: any) => {
          if (res["Success"]) {
            const map = new Map<string, any>();
            res.Data.forEach((item:any) => {
              if(!map.has(item.City))
              {
                map.set(item.City , item)
              }
              
            });
            
            this.CityList = Array.from(map.values())
          }
          this.isCityLoading = false;
        });
      }
    });
  }

  // --- Form Control Callbacks ---
  onStateSelected() {
    this.SearchForm.get('county')?.enable();
    this.SearchForm.get('county')?.reset();
    // this.SearchForm.get('city')?.disable();
    this.SearchForm.get('city')?.reset();
    this.CountyList = [];
    this.CityList = [];
  }

  onCountySelected() {
    this.SearchForm.get('city')?.enable();
    this.SearchForm.get('city')?.reset();
    this.CityList = [];
  }

  displayFn(val: any): string {
    return val || '';
  }

   CityTypeAheadDisplay(val: any) {
    let res = this.CityList.find(a => a.City == val);
    if (res != null) {
      return res.City;
    };
    return '';
  }

  StateTypeAheadDisplay(val: any) {
   
    let res = this.StateList.find(a => a.State == val);
    if (res != null) {
     
      return res.State;
    }
    return ''
  }

   CountyTypeAheadDisplay(val: any) {
    let res = this.CountyList.find(a => a.County == val);
    if (res != null) {
      return res.County;
    }
    return ''
  }

  // --- Main Logic for Adding Selections ---
  AddToList() {
    this.SearchForm.markAllAsTouched();
    if (this.SearchForm.invalid) return;

    const state = this.SearchForm.get('state')?.value;
    const county = this.SearchForm.get('county')?.value;
    const city = this.SearchForm.get('city')?.value;

    if (!state) return;

    let newLocation: Location;

    if (city) {
      newLocation = { State: state, County: county, City: city, Selected: 'Y' };
    } else if (county) {
      newLocation = { State: state, County: county, City: '', Selected: 'Y' };
    } else {
      newLocation = { State: state, County: '', City: '', Selected: 'Y' };
    }

    this.addLocation(newLocation);
    this.SearchForm.reset();
    this.onStateSelected(); 
  }

  addLocation(loc: Location) {
    if (loc.City) {
      this.selectedLocations = this.selectedLocations.filter(
        l => !(l.State === loc.State && l.County === loc.County && !l.City) &&
             !(l.State === loc.State && !l.County && !l.City)
      );
    } else if (loc.County) {
      this.selectedLocations = this.selectedLocations.filter(
        l => !(l.State === loc.State && l.County === loc.County) &&
             !(l.State === loc.State && !l.County)
      );
    } else {
      this.selectedLocations = this.selectedLocations.filter(l => l.State !== loc.State);
    }

    const exists = this.selectedLocations.some(l => l.State === loc.State && l.County === loc.County && l.City === loc.City);
    if (!exists) {
      this.selectedLocations.push(loc);
    }
    
    this.updateAndRefresh();
  }

  handleCitySelected(event: Location) {
    if (event.Selected === 'Y') {
      this.addLocation(event);
    } else {
      this.removeCity(event);
    }
  }

  // --- Removal Logic ---
  removeCity(cityToRemove: Location) {
    this.RemovedLocation = cityToRemove;
    this.selectedLocations = this.selectedLocations.filter(
      l => !(l.City === cityToRemove.City && l.County === cityToRemove.County && l.State === cityToRemove.State)
    );
    this.updateAndRefresh();
  }

  removeCounty(countyToRemove: GroupedByCounty, state: string) {
    this.RemovedLocation = { County: countyToRemove.county, State: state };
    this.selectedLocations = this.selectedLocations.filter(
      l => !(l.County === countyToRemove.county && l.State === state)
    );
    this.updateAndRefresh();
  }

  removeState(stateToRemove: string) {
    this.RemovedLocation = { State: stateToRemove };
    this.selectedLocations = this.selectedLocations.filter(l => l.State !== stateToRemove);
    this.updateAndRefresh();
  }
  
  // --- Data Grouping & Refresh ---
  private updateAndRefresh() {
    this.selectedLocations = [...this.selectedLocations];
    this.updateGroupedLocations();
  }

  updateGroupedLocations() {
    const stateMap = new Map<string, { counties: Map<string, { cities: Location[], isCountyOnly: boolean }>, isStateOnly: boolean }>();

    for (const loc of this.selectedLocations) {
      if (!loc.State) continue;

      if (!stateMap.has(loc.State)) {
        stateMap.set(loc.State, { isStateOnly: false, counties: new Map() });
      }
      const stateGroup = stateMap.get(loc.State)!;

      if (!loc.County && !loc.City) {
        stateGroup.isStateOnly = true;
        stateGroup.counties.clear();
        continue;
      }
      stateGroup.isStateOnly = false;
      
      if (loc.County) {
        if (!stateGroup.counties.has(loc.County)) {
          stateGroup.counties.set(loc.County, { isCountyOnly: false, cities: [] });
        }
        const countyGroup = stateGroup.counties.get(loc.County)!;
        
        if (!loc.City) {
          countyGroup.isCountyOnly = true;
          countyGroup.cities = [];
          continue;
        }
        countyGroup.isCountyOnly = false;
        countyGroup.cities.push(loc);
      }
    }

    this.groupedLocations = Array.from(stateMap.entries()).map(([state, data]) => ({
      state,
      isStateOnly: data.isStateOnly,
      counties: Array.from(data.counties.entries()).map(([county, countyData]) => ({
        county,
        isCountyOnly: countyData.isCountyOnly,
        cities: countyData.cities.sort((a, b) => a.City.localeCompare(b.City)),
      })).sort((a, b) => a.county.localeCompare(b.county)),
    })).sort((a, b) => a.state.localeCompare(b.state));
  }

  // --- Navigation ---
  Search() {
    this.datatransferService.setData({
      'data': this.selectedLocations,
      'NavigatedFrom': 'Home'
    });
    this.router.navigate(["permits/PermitList"]);
  }
}
