import { Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent {
  userActivity:Array<any> = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string='';
  constructor(private themeService: NbThemeService)
  {

  }
  ngOninit()
  {
    debugger
     this.userActivity =[
      {
      'VisitCount' : 80,
      date : new Date(),
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 10,
      date : new Date().getDate()-1,
      newVisits : 20,
      deltaUp : false
     },
     {
      'VisitCount' : 10,
      date : new Date().getDate()-2,
      newVisits : 20,
      deltaUp : false
     },
     {
      'VisitCount' : 50,
      date : new Date().getDate()-3,
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 20,
      date : new Date().getDate()-4,
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 30,
      date : new Date(),
      newVisits : 20,
      deltaUp : true
     }
  ];
     this.currentTheme = this.themeService.currentTheme;
  }
  ngAfterViewInit()
  {
      this.userActivity =[
      {
      'VisitCount' : 80,
      date : new Date(),
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 10,
      date : new Date().getDate()-1,
      newVisits : 20,
      deltaUp : false
     },
     {
      'VisitCount' : 10,
      date : new Date().getDate()-2,
      newVisits : 20,
      deltaUp : false
     },
     {
      'VisitCount' : 50,
      date : new Date().getDate()-3,
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 20,
      date : new Date().getDate()-4,
      newVisits : 20,
      deltaUp : true
     },
     {
      'VisitCount' : 30,
      date : new Date(),
      newVisits : 20,
      deltaUp : true
     }
  ];
  }
 

}
