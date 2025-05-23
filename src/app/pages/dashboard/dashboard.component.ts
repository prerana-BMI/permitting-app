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
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  constructor() {
    this.statusCards = [{ ...this.lightCard }, { ...this.rollerShadesCard }, { ...this.wirelessAudioCard }, { ...this.coffeeMakerCard }]
  }

  ngOnInit() {

  }
}
