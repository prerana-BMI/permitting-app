import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CardSettings } from 'src/app/Models/Models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  statusCards :Array<any>= []; 
   on : boolean = true;
  lightCard: CardSettings = {
    title: 'Open',
    iconClass: 'nb-lightbulb',
    type: 'primary',
    count: 20
  };
  rollerShadesCard: CardSettings = {
    title: 'Closed',
    iconClass: 'nb-roller-shades',
    type: 'success',
    count: 80,
  };
  wirelessAudioCard: CardSettings = {
    title: 'InProcess',
    iconClass: 'nb-audio',
    type: 'info',
    count: 10,
  };
  coffeeMakerCard: CardSettings = {
    title: 'Rejected',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
    count: 5,
  };

  constructor() {
    this.statusCards = [{ ...this.lightCard }, { ...this.rollerShadesCard }, { ...this.wirelessAudioCard }, { ...this.coffeeMakerCard }]
  }

  ngOnInit() {

  }
}
