import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selected-permit',
  templateUrl: './selected-permit.component.html',
  styleUrls: ['./selected-permit.component.scss']
})
export class SelectedPermitComponent {
  constructor(public dialogRef: MatDialogRef<SelectedPermitComponent>,)
  {

  }
searchTerm = '';

  permitCategories = [
    {
      name: 'Air Quality Permits',
      count: 2,
      colorClass: 'bg-secondary text-white',
      expanded: false,
      permits: [
        { name: 'Air Permit A', level: 'State' },
        { name: 'Air Permit B', level: 'Federal' }
      ]
    },
    {
      name: 'Coastal Zone Permits',
      count: 1,
      colorClass: 'bg-secondary text-white',
      expanded: false,
      permits: [
        { name: 'Coastal Permit C', level: 'County' }
      ]
    },
    {
      name: 'Solid and Hazardous Waste Permits',
      count: 1,
      colorClass: 'bg-secondary text-white',
      expanded: false,
      permits: [
        { name: 'Hazardous Permit D', level: 'State' }
      ]
    },
    {
      name: 'Wastewater and Stormwater Permits',
      count: 2,
      colorClass: 'bg-secondary text-white',
      expanded: false,
      permits: [
        { name: 'Stormwater Permit E', level: 'Federal' },
        { name: 'Stormwater Permit F', level: 'State' }
      ]
    },
    {
      name: 'Wetlands/Surface Water Permits',
      count: 3,
      colorClass: 'bg-secondary text-white',
      expanded: false,
      permits: [
        { name: 'Wetland Permit G', level: 'County' },
        { name: 'Wetland Permit H', level: 'State' },
        { name: 'Wetland Permit I', level: 'Federal' }
      ]
    }
  ];

  toggleCategory(index: number): void {
  this.permitCategories.forEach((cat, i) => {
    cat.expanded = i === index ? !cat.expanded : false;
  });
}
clear() {
    this.dialogRef.close()
  }
}
