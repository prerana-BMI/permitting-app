import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  selectedMarker!: L.Marker;
  selectedLatLng: L.LatLng | null = null;
  MapData :any={}
  @Output() citySelected  = new EventEmitter<object>(); 
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

 private initializeMap(): void {
  const baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Define the USA bounds
  const usaBounds = L.latLngBounds(
    [24.396308, -125.000000], // Southwest
    [49.384358, -66.934570]   // Northeast
  );

  // Create the map with restricted bounds
  this.map = L.map('map', {
    maxBounds: usaBounds,         // Restrict panning
    maxBoundsViscosity: 1.0,      // Prevent dragging out of bounds
    minZoom: 4,
    maxZoom: 18
  }).fitBounds(usaBounds);        // Initially zoom to US

  L.tileLayer(baseMapUrl, {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  // Map click handler
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
    this.MapData ={
        City : address.city,
        State : address.state
      }
      this.citySelected.emit(this.MapData);
      console.log('Selected City:',  address.city || 'Unknown location');
    })
    .catch(err => {
      console.error('Reverse geocoding error:', err);
    });
}

}
