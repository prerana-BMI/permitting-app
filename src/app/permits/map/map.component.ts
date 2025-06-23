import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input, SimpleChanges  , OnChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit , OnChanges {
  private map!: L.Map;
  selectedMarker!: L.Marker;
  selectedLatLng: L.LatLng | null = null;
  MapData: any = {};
  @Input() StateName : string =''
  @Output() citySelected = new EventEmitter<object>();

   stateLayer: L.GeoJSON | null = null;
  constructor() {}

  ngOnInit(): void {}

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

 private setMarker(latlng: L.LatLng): void {
  if (this.selectedMarker) {
    this.selectedMarker.setLatLng(latlng);
  } else {
    this.selectedMarker = L.marker(latlng).addTo(this.map);
  }
  this.selectedLatLng = latlng;

  
    this.getCityName(latlng.lat, latlng.lng);
  
}

  private getCityName(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        const address = data.address;
        this.MapData = {
          City: address.city || address.town || address.village || 'Unknown',
          State: address.state || 'Unknown'
        };
        this.citySelected.emit(this.MapData);
        console.log('Selected City:', this.MapData);
      })
      .catch(err => {
        console.error('Reverse geocoding error:', err);
      });
  }

  // 🔍 Call this method with a state name
  public fitMapToState(stateName: string): void {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(stateName + ', USA')}&polygon_geojson=1&format=json`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
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
      })
      .catch(err => {
        console.error('Geocoding error:', err);
      });
  }

  // 🔹 Example: use this from an input binding or a button
 ngOnChanges(changes: SimpleChanges): void {
  console.log(changes)
   if (changes['StateName'] && changes['StateName'].currentValue) {
    const newState = changes['StateName'].currentValue;
    this.fitMapToState(newState);
  }
  else{
      const usaBounds = L.latLngBounds(
      [24.396308, -125.000000],
      [49.384358, -66.934570]
    );
    this.map.fitBounds(usaBounds)
    
  }

}
}
