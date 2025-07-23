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

  if (location?.City && location?.State) {
    const key = this.createMarkerKey(location.City, location.State);

    // Prevent duplicate marker
    if (this.markerMap.has(key)) {
      this.isProcessing = false;
      return;
    }

    const marker = L.marker(latlng).addTo(this.map);

    marker.on('click', async () => {
      this.map.removeLayer(marker);
      this.markerMap.delete(key);
      this.selectedMarker = this.selectedMarker.filter(m => m !== marker);
      await this.getCityName(latlng.lat, latlng.lng, 'N');
    });

    this.selectedMarker.push(marker);
    this.markerMap.set(key, marker); 
    await this.fitMapToState(location.State);
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
    if (changes['selectedLocationsFromParent'] && !changes['selectedLocationsFromParent'].firstChange) {
      const prev = changes['selectedLocationsFromParent'].previousValue;
      const current = changes['selectedLocationsFromParent'].currentValue;

      // Find removed items
      const removed = prev.filter((prevItem: any) =>
        !current.some((curItem: any) =>
          curItem.City === prevItem.City && curItem.State === prevItem.State
        )
      );

      removed.forEach((location: any) => {
        this.removeMarkerForLocation(location);
      });
    }

  }
  private removeMarkerForLocation(location: { City: string; State: string }) {
    const key = this.createMarkerKey(location.City, location.State);
    const marker = this.markerMap.get(key);
    if (marker) {
      this.map.removeLayer(marker);
      this.markerMap.delete(key);
      this.selectedMarker = this.selectedMarker.filter(m => m !== marker);
    }

  }

  createMarkerKey(city: string, state: string): string {
    return `${city}|${state}`;
  }
}
