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
  private countyGeojson: any;

  private cityLayer!: L.LayerGroup;
  private markerMap = new Map<string, L.Marker>();
  private latLngCache = new Map<string, L.LatLng>();

  private selectedStateLayers = new Map<string, L.Layer>();
  private stateCountyLayers = new Map<string, L.GeoJSON>(); 

  private isUpdating = false;

  @Output() citySelected = new EventEmitter<{ City: string, State: string, County: string, Selected: 'Y' | 'N' }>();
  @Input() selectedLocationsFromParent: { City: string; State: string; County?: string; Selected?: string }[] = [];

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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['selectedLocationsFromParent'] && this.map) {
      if (this.isUpdating) { return; }
      this.isUpdating = true;
      try {
        this.updateSelectedStates();
        await this.syncMarkersWithParent();
        this.updateCountyHighlights();
      } finally {
        this.isUpdating = false;
      }
    }
  }

  private async initializeUSMap(): Promise<void> {
    const usaBounds = L.latLngBounds([24.396308, -125.000000], [49.384358, -66.934570]);
    this.map = L.map('map', {
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: false,
      maxBounds: usaBounds,
      maxBoundsViscosity: 1.0
    }).fitBounds(usaBounds);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.cityLayer = L.layerGroup().addTo(this.map);

    const geoData = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json').then(res => res.json());
    this.countyGeojson = await fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json').then(res => res.json());

    const style = (feature: any) => ({
      fillColor: '#f9efe6',
      weight: 3,
      opacity: 0.6,
      color: '#838589ff',
      dashArray: 'null',
      fillOpacity: 0.25
    });

    const onEachFeature = (feature: any, layer: L.Layer) => {
      layer.bindTooltip(feature.properties.name);
      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const stateName = feature.properties.name;
          if (!this.selectedStateLayers.has(stateName)) {
            e.target.setStyle({ weight: 3, color: '#3366cc', fillColor: '#c9d9f7', fillOpacity: 0.65 });
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const stateName = feature.properties.name;
          if (this.selectedStateLayers.has(stateName)) {
            e.target.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
          } else {
            e.target.setStyle({ color: '#838589ff', fillColor: '#f9efe6', weight: 3, fillOpacity: 0.25 });
          }
        },
        click: (e: L.LeafletMouseEvent) => {
          const stateName = feature.properties.name;
          const isSelected = this.selectedLocationsFromParent.some(l => l.State === stateName && l.Selected === 'Y');
          this.citySelected.emit({ State: stateName, Selected: isSelected ? 'N' : 'Y', City: '', County: '' });
        }
      });
    };

    this.geojson = L.geoJson(geoData, { style, onEachFeature }).addTo(this.map);
    this.map.on('click', (event: L.LeafletMouseEvent) => this.onMapClick(event));
    
    if (this.selectedLocationsFromParent.length > 0) {
        this.updateSelectedStates();
        await this.syncMarkersWithParent();
        this.updateCountyHighlights();
    }
  }

  private updateSelectedStates(): void {
    const selectedStatesFromParent = new Set((this.selectedLocationsFromParent || []).filter(loc => loc.Selected === 'Y').map(loc => loc.State));

    this.geojson.eachLayer((layer: any) => {
        const stateName = layer.feature.properties.name;
        if (selectedStatesFromParent.has(stateName)) {
            if (!this.selectedStateLayers.has(stateName)) {
                this.selectedStateLayers.set(stateName, layer);
                layer.setStyle({ color: '#073a9fff', fillColor: '#98a8c8ff', weight: 3, fillOpacity: 0.55 });
                this.addStateCounties(stateName);
            }
        } else {
            if (this.selectedStateLayers.has(stateName)) {
                const stateLayer = this.selectedStateLayers.get(stateName) as any;
                stateLayer.setStyle({ color: '#838589ff', fillColor: '#f9efe6', weight: 3, fillOpacity: 0.25 });
                this.selectedStateLayers.delete(stateName);
                this.removeStateCounties(stateName);
            }
        }
    });
  }

  private addStateCounties(stateName: string): void {
    if (this.stateCountyLayers.has(stateName)) return;

    const stateId = this.getStateId(stateName);
    if (!stateId) return;

    const onEachCountyFeature = (feature: any, layer: L.Layer) => {
      const countyName = feature.properties.NAME;
      layer.bindTooltip(`County - ${countyName}<br>State - ${stateName}`);
      layer.on({
          click: () => {
            const isSelected = this.isCountySelected(stateName, countyName);
            this.citySelected.emit({ State: stateName, County: countyName, City: '', Selected: isSelected ? 'N' : 'Y' });
          }
      });
  };

    const countyLayer = L.geoJson(this.countyGeojson, {
        filter: (feature) => feature.properties.STATE === stateId,
        style: { 
            fillColor: 'transparent',
            weight: 1,
            opacity: 0.5,
            color: '#333',
            fillOpacity: 0.2
        },
        onEachFeature: onEachCountyFeature
    }).addTo(this.map);
    this.stateCountyLayers.set(stateName, countyLayer);
    this.updateCountyHighlights(); 
  }

  private removeStateCounties(stateName: string): void {
    const countyLayer = this.stateCountyLayers.get(stateName);
    if (countyLayer) {
        this.map.removeLayer(countyLayer);
        this.stateCountyLayers.delete(stateName);
    }
  }

  private isCountySelected(stateName: string, countyName: string): boolean {
    return (this.selectedLocationsFromParent || []).some(
      loc => loc.Selected === 'Y' && loc.State === stateName && loc.County === countyName
    );
  }

  private updateCountyHighlights(): void {
    const highlightedCountyStyle = { weight: 2, color: 'red', fillOpacity: 0.4, fillColor: '#ff0000' };
    const defaultCountyStyle = { weight: 1, color: '#333', fillOpacity: 0.2, fillColor: 'transparent' };

    const selectedCounties = new Set(
        (this.selectedLocationsFromParent || [])
            .filter(loc => loc.Selected === 'Y' &&  loc.County)
            .map(loc => `${loc.State}|${loc.County}`)
    );

    this.stateCountyLayers.forEach((countyLayer, stateName) => {
        countyLayer.eachLayer((layer: any) => {
            const countyName = layer.feature.properties.NAME;
            const key = `${stateName}|${countyName}`;
            layer.setStyle(selectedCounties.has(key) ? highlightedCountyStyle : defaultCountyStyle);
        });
    });
  }

  private async syncMarkersWithParent(): Promise<void> {
    const parentCities = new Map<string, { City: string; State: string; County?: string; Selected?: string }>();
    (this.selectedLocationsFromParent || [])
      .filter(l => l.City && l.Selected === 'Y')
      .forEach(loc => {
        const key = `${loc.City}|${loc.State}`;
        parentCities.set(key, loc);
      });

    this.markerMap.forEach((marker, key) => {
      if (!parentCities.has(key)) {
        this.cityLayer.removeLayer(marker);
        this.markerMap.delete(key);
      }
    });

    const citiesToAdd: { City: string; State: string; County?: string; Selected?: string }[] = [];
    parentCities.forEach((loc, key) => {
      if (!this.markerMap.has(key)) {
        citiesToAdd.push(loc);
      }
    });

    if (citiesToAdd.length === 0) return;

    const locationPromises = citiesToAdd.map(loc => this.getLatLngFromCityState(loc.City!, loc.State));
    const coordinates = await Promise.all(locationPromises);

    citiesToAdd.forEach((loc, index) => {
      const latlng = coordinates[index];
      if (latlng) {
        const normalizedCounty = (loc.County || '').replace(/ (County|Parish)$/, '');
        const key = `${loc.City}|${loc.State}`;
        
        if (this.markerMap.has(key)) return;

        const marker = L.marker(latlng, { icon: this.cityIcon })
          .addTo(this.cityLayer)
          .bindTooltip(`${loc.City}, ${loc.State}`, { permanent: false, direction: 'top', opacity: 0.9 });

        marker.on('click', () => {
          this.citySelected.emit({ City: loc.City!, State: loc.State, County: normalizedCounty, Selected: 'N' });
        });
        this.markerMap.set(key, marker);
      }
    });
  }

  private async onMapClick(event: L.LeafletMouseEvent): Promise<void> {
    if (this.map.getZoom() < 6) return;

    const locationInfo = await this.getCityName(event.latlng.lat, event.latlng.lng);
    const { City, State, County} = locationInfo;

    if (!State || !City || City === 'Unknown') {
      return;
    }

    let finalCounty = County;

    if (!finalCounty || finalCounty === 'Unknown') {
      finalCounty = this.findCountyLocally(event.latlng, State) || "";
    }

    if (finalCounty && finalCounty !== 'Unknown') {
      this.citySelected.emit({ City, State, County: finalCounty, Selected: 'Y' });
    }
  }

  private findCountyLocally(latlng: L.LatLng, stateName: string): string | null {
    const stateId = this.getStateId(stateName);
    if (!stateId || !this.countyGeojson) return null;

    const point = [latlng.lng, latlng.lat];
    const features = this.countyGeojson.features.filter((feature: any) => feature.properties.STATE === stateId);

    for (const feature of features) {
      if (this.isPointInMultiPolygon(point, feature.geometry.coordinates)) {
        return feature.properties.NAME;
      }
    }

    return null;
  }

  private isPointInMultiPolygon(point: number[], multiPolygon: any[]): boolean {
    for (const polygon of multiPolygon) {
      if (this.isPointInPolygon(point, polygon[0])) {
        return true;
      }
    }
    return false;
  }
  
  private isPointInPolygon(point: number[], polygon: number[][]): boolean {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  }
  
  private async getCityName(lat: number, lon: number): Promise<{ City: string; State: string, County: string }> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const address = data.address;
      const county = (address.county || '').replace(/ (County|Parish)$/, '');
      return { City: address.city || address.town || address.village || 'Unknown', State: address.state || 'Unknown', County: county || 'Unknown' };
    } catch (err) {
      return { City: 'Unknown', State: 'Unknown', County: 'Unknown' };
    }
  }

  private async getLatLngFromCityState(city: string, state: string): Promise<L.LatLng | null> {
    const key = `${city}|${state}`;
    if (this.latLngCache.has(key)) {
      return this.latLngCache.get(key)!;
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=USA&format=json`);
      const data = await res.json();
      if (data && data.length > 0) {
        const latlng = L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
        this.latLngCache.set(key, latlng);
        return latlng;
      }
      return null;
    } catch {
      return null;
    }
  }

  private getStateId(stateName: string): string | null {
    const stateMappings: { [key: string]: string } = {
        "Alabama": "01", "Alaska": "02", "Arizona": "04", "Arkansas": "05", "California": "06",
        "Colorado": "08", "Connecticut": "09", "Delaware": "10", "Florida": "12", "Georgia": "13",
        "Hawaii": "15", "Idaho": "16", "Illinois": "17", "Indiana": "18", "Iowa": "19", "Kansas": "20",
        "Kentucky": "21", "Louisiana": "22", "Maine": "23", "Maryland": "24", "Massachusetts": "25",
        "Michigan": "26", "Minnesota": "27", "Mississippi": "28", "Missouri": "29", "Montana": "30",
        "Nebraska": "31", "Nevada": "32", "New Hampshire": "33", "New Jersey": "34", "New Mexico": "35",
        "New York": "36", "North Carolina": "37", "North Dakota": "38", "Ohio": "39", "Oklahoma": "40",
        "Oregon": "41", "Pennsylvania": "42", "Rhode Island": "44", "South Carolina": "45", "South Dakota": "46",
        "Tennessee": "47", "Texas": "48", "Utah": "49", "Vermont": "50", "Virginia": "51", "Washington": "53",
        "West Virginia": "54", "Wisconsin": "55", "Wyoming": "56"
    };
    return stateMappings[stateName] || null;
  }
}
