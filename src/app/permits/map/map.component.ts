import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  private map!: L.Map;
  selectedMarker: L.Marker[] = []
  MapData: any = {};
  @Output() citySelected = new EventEmitter<object>();
  isProcessing: boolean = false;
  @Input() selectedLocationsFromParent: { City: string; State: string }[] = [];
  markerMap = new Map<string, L.Marker>();
  stateLayer: L.GeoJSON | null = null;
  constructor(private LoaderserviceService: LoaderService) {

  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    const baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const usaBounds = L.latLngBounds(
      [24.396308, -125.000000],
      [49.384358, -66.934570]
    );

    this.map = L.map('map', {
      maxBounds: usaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 4,
      maxZoom: 18
    }).fitBounds(usaBounds);

    L.tileLayer(baseMapUrl, {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.setMarker(event.latlng);
    });
  }

private async setMarker(latlng: L.LatLng): Promise<void> {
 
  if (this.isProcessing) {
    console.log("Still processing...");
    return;
  }
  this.isProcessing = true;
  const location = await this.getCityName(latlng.lat, latlng.lng, 'Y');
  await this.fitMapToState(location.State);
  if (location?.City && location?.State) {
    const key = this.createMarkerKey(location.City, location.State);

    // Prevent duplicate marker
    if (this.markerMap.has(key)) {
      this.isProcessing = false;
      return;
    }

    
    const marker = L.marker(latlng)
  .addTo(this.map)
  .bindTooltip(`${location.City}, ${location.State}`, {
    permanent: false,
    direction: 'top',
    opacity: 0.9,
  });

   this.attachClickHandlerToMarker(marker, location.City, location.State, key);

     this.selectedMarker.push(marker);
    this.markerMap.set(key, marker); 
    
  }

  this.isProcessing = false;
}


  private async getCityName(lat: number, lon: number, selected: string): Promise<{ City: string; State: string }> {

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      const address = data.address;
      const result = {
        City: address.city || address.town || address.village || 'Unknown',
        State: address.state || 'Unknown',
        Selected: selected
      };
      
      this.citySelected.emit(result);

      console.log('Selected City:', result);
      return result;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return { City: 'Unknown', State: 'Unknown' };
    }
  }


  // 🔍 Call this method with a state name
  public async fitMapToState(stateName: string): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(stateName + ', USA')}&polygon_geojson=1&format=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const result = data[0];
        const bbox = result.boundingbox;
        const southWest = L.latLng(parseFloat(bbox[0]), parseFloat(bbox[2]));
        const northEast = L.latLng(parseFloat(bbox[1]), parseFloat(bbox[3]));
        const bounds = L.latLngBounds(southWest, northEast);

        this.map.fitBounds(bounds); // 📌 Zoom to state

        if (this.stateLayer) {
          this.map.removeLayer(this.stateLayer);
        }

        if (result.geojson) {
          this.stateLayer = L.geoJSON(result.geojson, {
            style: {
              color: 'blue',
              weight: 2,
              fillColor: 'rgba(0, 0, 255, 0.2)',
              fillOpacity: 0.3
            }
          }).addTo(this.map);
        }
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  }

  // 🔹 Example: use this from an input binding or a button
  ngOnChanges(changes: SimpleChanges): void {
    
  const current = changes['selectedLocationsFromParent'].currentValue;
if(current.Selected =='N')
{
 this.removeMarkerForLocation(current);
}
else if (current.Selected =='Y'){
this.addMarkerByCityState(current.City, current.State)
}
  
 }

//   private removeMarkerForLocation(location: { City: string; State: string }) {
//     const key = this.createMarkerKey(location.City, location.State);
//     const marker = this.markerMap.get(key);
//     if (marker && location.City == undefined) {
//        for (const [markerKey, m] of this.markerMap.entries()) {
         
//           this.map.removeLayer(m);
//           this.markerMap.delete(markerKey);
//           this.selectedMarker = this.selectedMarker.filter(existing => existing !== m);
//         }
//     }
//     else {
//   const entriesToRemove = Array.from(this.markerMap.entries()).filter(([key, marker]) => {
//     const [city, state] = key.split('|');
//     return city === location.City;
//   });

//   for (const [key, marker] of entriesToRemove) {
//     this.map.removeLayer(marker);
//     this.markerMap.delete(key);
//     this.selectedMarker = this.selectedMarker.filter(m => m !== marker);
//   }
//     //   this.map.removeLayer(markersForCity);
//     //   this.markerMap.delete(key);
//     //   this.selectedMarker = this.selectedMarker.filter(m => m !== marker);
//     // }

//   }
// }
private removeMarkerForLocation(location: { City: string; State: string }) {
  

  const isStateLevelRemove = !location.City || location.City === 'Unknown';

  if (isStateLevelRemove && location.State) {
    // Remove all markers for the specified state
    const entriesToRemove = Array.from(this.markerMap.entries()).filter(([key]) => {
      const [, state] = key.split('|');
      return state === location.State;
    });

    for (const [key, marker] of entriesToRemove) {
      this.map.removeLayer(marker);
      this.selectedMarker = this.selectedMarker.filter(existing => existing !== marker);
      this.markerMap.delete(key);
    }
    return;
  }

  // Match markers by both City and State (single marker)
  const keyToRemove = this.createMarkerKey(location.City, location.State);
  const marker = this.markerMap.get(keyToRemove);

  if (marker) {
    this.map.removeLayer(marker);
    this.selectedMarker = this.selectedMarker.filter(existing => existing !== marker);
    this.markerMap.delete(keyToRemove);
  }
}



  createMarkerKey(city: string, state: string): string {
    return `${city}|${state}`;
  }

  private async addMarkerByCityState(city: string, state: string): Promise<void> {
  if (this.isProcessing) return;
 const latlng = await this.getCoordinatesFromCityState(city, state);

  if(latlng != null)
  {
    const key = this.createMarkerKey(city, state);

    // Prevent duplicate marker
    if (this.markerMap.has(key)) {
      this.isProcessing = false;
      return;
    }
const marker = L.marker(latlng)
  .addTo(this.map)
  .bindTooltip(`${city}, ${state}`, {
    permanent: false,
    direction: 'top',
    opacity: 0.9,
  });
  this.attachClickHandlerToMarker(marker, city, state, key);
 const result = {
        City: city,
        State: state,
        Selected: 'Y'
      };
       this.selectedMarker.push(marker);
this.markerMap.set(key, marker); 
      this.citySelected.emit(result);


   }
 
}

private async getCoordinatesFromCityState(city: string, state: string): Promise<L.LatLng | null> {
  try {
    const query = `${city}, ${state}, USA`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    const data = await res.json();

    if (data.length > 0 && data[0].lat && data[0].lon) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return L.latLng(lat, lon);
    }

    console.warn(`No results found for ${query}`);
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

private attachClickHandlerToMarker(marker: L.Marker, city: string, state: string, key: string): void {
  marker.on('click', async () => {

    if (city === "Unknown" && state) {
      // Remove all markers with matching state
      const entriesToRemove = Array.from(this.markerMap.entries()).filter(([markerKey]) => {
        const [, s] = markerKey.split('|');
        return s === state;
      });

      for (const [markerKey, m] of entriesToRemove) {
        this.map.removeLayer(m);
        this.markerMap.delete(markerKey);
        this.selectedMarker = this.selectedMarker.filter(existing => existing !== m);
      }
    } else {
      // Remove single marker
      this.map.removeLayer(marker);
      this.markerMap.delete(key);
      this.selectedMarker = this.selectedMarker.filter(m => m !== marker);
    }

    // Notify parent about deselection
    const result = {
      City: city,
      State: state,
      Selected: 'N'
    };
    this.citySelected.emit(result);

    this.isProcessing = false;
  });
}


}
