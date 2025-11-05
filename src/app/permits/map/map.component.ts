import { Component, AfterViewInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map!: L.Map;
  private geojson!: L.GeoJSON;
  private infoDiv!: HTMLElement;
  private cityLayer!: L.LayerGroup;
  private markerMap = new Map<string, L.Marker>();
  private selectedStateLayers = new Map<string, L.Layer>();

  @Output() citySelected = new EventEmitter<{ City: string, State: string, Selected: 'Y' | 'N' }>();
  @Input() selectedLocationsFromParent: { City: string; State: string; Selected?: string }[] = [];

  private cityIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  ngAfterViewInit(): void {
    this.initializeUSMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocationsFromParent'] && this.map) {
        this.highlightSelectedStates();
        this.syncMarkersWithParent();
    }
  }

  private async initializeUSMap(): Promise<void> {
    const usaBounds = L.latLngBounds([24.396308, -125.000000], [49.384358, -66.934570]);
    this.map = L.map('map', {
      minZoom: 4,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: false,
      maxBounds: usaBounds,
      maxBoundsViscosity: 1.0
    }).fitBounds(usaBounds);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 10,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.cityLayer = L.layerGroup().addTo(this.map);
    this.infoDiv = document.getElementById('info') as HTMLElement;
    if (this.infoDiv) this.infoDiv.innerHTML = 'Hover over a state';

    const geoData = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json').then(res => res.json());

    const style = (feature: any) => ({
      fillColor: '#f9efe6',
      weight: 3,
      opacity: 0.6,
      color: '#838589ff',
      dashArray: 'null',
      fillOpacity: 0.25
    });

    const highlightFeature = (e: any) => {
        const layer = e.target;
        const stateName = layer.feature.properties.name;
        if (!this.selectedStateLayers.has(stateName)) {
            layer.setStyle({ weight: 3, color: '#3366cc', fillColor: '#c9d9f7', fillOpacity: 0.65 });
        }
        layer.bringToFront();
        if (this.infoDiv) this.infoDiv.innerHTML = `<b>${stateName}</b>`;
    };

    const resetHighlight = (e: any) => {
        const layer = e.target;
        const stateName = layer.feature.properties.name;
        if (this.selectedStateLayers.has(stateName)) {
            layer.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
        } else {
            layer.setStyle({ color: '#838589ff', fillColor: '#f9efe6', weight: 3, fillOpacity: 0.25 });
        }
        if (this.infoDiv) this.infoDiv.innerHTML = 'Hover over a state';
    };

    const zoomToFeature = (e: any) => {
        const layer = e.target;
        const stateName = layer.feature.properties.name;

        if (this.selectedStateLayers.has(stateName)) {
            this.selectedStateLayers.delete(stateName);
            layer.setStyle({ weight: 3, color: '#3366cc', fillColor: '#c9d9f7', fillOpacity: 0.65 });
            this.citySelected.emit({ State: stateName, Selected: 'N', City: '' });
        } else {
            this.selectedStateLayers.set(stateName, layer);
            layer.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
            this.map.fitBounds(layer.getBounds().pad(0.3));
            this.citySelected.emit({ State: stateName, Selected: 'Y', City: '' });
        }
    };

    const onEachFeature = (feature: any, layer: L.Layer) => {
      layer.on({ mouseover: highlightFeature, mouseout: resetHighlight, click: zoomToFeature });
    };

    this.geojson = L.geoJson(geoData, { style, onEachFeature }).addTo(this.map);
    this.map.on('click', (event: L.LeafletMouseEvent) => this.onMapClick(event));
  }

  private highlightSelectedStates(): void {
    const selectedStatesFromParent = new Set((this.selectedLocationsFromParent || []).map(loc => loc.State?.toLowerCase()).filter(s => s));

    this.geojson.eachLayer((layer: any) => {
        const stateName = layer.feature.properties.name;
        const stateNameLower = stateName.toLowerCase();
        
        if (selectedStatesFromParent.has(stateNameLower)) {
            if (!this.selectedStateLayers.has(stateName)) {
                this.selectedStateLayers.set(stateName, layer);
                layer.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
            }
        } else {
            if (this.selectedStateLayers.has(stateName)) {
                this.selectedStateLayers.delete(stateName);
                layer.setStyle({ color: '#838589ff', fillColor: '#f9efe6', weight: 3, fillOpacity: 0.25 });
            }
        }
    });
  }

  private async onMapClick(event: L.LeafletMouseEvent): Promise<void> {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;
    const location = await this.getCityName(lat, lon);

    if (!location.State || location.City === 'Unknown') return;

    const key = `${location.City}|${location.State}|${lat.toFixed(5)}|${lon.toFixed(5)}`;

    if (this.markerMap.has(key)) {
      const marker = this.markerMap.get(key)!;
      this.map.removeLayer(marker);
      this.markerMap.delete(key);
      this.citySelected.emit({ City: location.City, State: location.State, Selected: 'N' });
      return;
    }

    const marker = L.marker(event.latlng, { icon: this.cityIcon })
      .addTo(this.cityLayer)
      .bindTooltip(`${location.City}, ${location.State}`, { permanent: false, direction: 'top', opacity: 0.9 });

    marker.on('click', () => {
      this.map.removeLayer(marker);
      this.markerMap.delete(key);
      this.citySelected.emit({ City: location.City, State: location.State, Selected: 'N' });
    });

    this.markerMap.set(key, marker);
    this.citySelected.emit({ City: location.City, State: location.State, Selected: 'Y' });

    if (!this.selectedStateLayers.has(location.State)) {
        this.geojson.eachLayer((layer: any) => {
            if (layer.feature.properties.name === location.State) {
                this.selectedStateLayers.set(location.State, layer);
                layer.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
            }
        });
    }
  }

  private async getCityName(lat: number, lon: number): Promise<{ City: string; State: string }> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const address = data.address;
      return { City: address.city || address.town || address.village || 'Unknown', State: address.state || 'Unknown' };
    } catch (err) {
      return { City: 'Unknown', State: 'Unknown' };
    }
  }

  private syncMarkersWithParent(): void {
    const parentKeys = new Set((this.selectedLocationsFromParent || []).filter(l => l.City).map(loc => `${loc.City}|${loc.State}`));

    for (const [key, marker] of Array.from(this.markerMap.entries())) {
      const [city, state] = key.split('|');
      if (!parentKeys.has(`${city}|${state}`)) {
        this.cityLayer.removeLayer(marker);
        this.markerMap.delete(key);
      }
    }

    (this.selectedLocationsFromParent || []).forEach(loc => {
      if (!loc.City) return;
      
      const markerExists = Array.from(this.markerMap.keys()).some(k => k.startsWith(`${loc.City}|${loc.State}`));

      if (!markerExists) {
        this.getLatLngFromCityState(loc.City, loc.State).then(latlng => {
          if (latlng) {
            const key = `${loc.City}|${loc.State}|${latlng.lat.toFixed(5)}|${latlng.lng.toFixed(5)}`;
            const marker = L.marker(latlng, { icon: this.cityIcon })
              .addTo(this.cityLayer)
              .bindTooltip(`${loc.City}, ${loc.State}`, { permanent: false, direction: 'top', opacity: 0.9 });
            
            marker.on('click', () => {
              this.cityLayer.removeLayer(marker);
              this.markerMap.delete(key);
              this.citySelected.emit({ City: loc.City, State: loc.State, Selected: 'N' });
            });

            this.markerMap.set(key, marker);
          }
        });
      }
    });
  }

  private async getLatLngFromCityState(city: string, state: string): Promise<L.LatLng | null> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=USA&format=json`);
      const data = await res.json();
      if (data && data.length > 0) return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
      return null;
    } catch {
      return null;
    }
  }
}
