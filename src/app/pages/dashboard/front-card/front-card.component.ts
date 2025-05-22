import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-front-card',
  templateUrl: './front-card.component.html',
  styleUrls: ['./front-card.component.scss']
})
export class FrontCardComponent {
 flipped = false;
 @Input() front :boolean= false;

  toggleView() {
    this.flipped = !this.flipped;
  }
    linChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
 lineChartType: ChartType = 'line';
   
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: '2025',
        fill: true,
        tension: 0.4,
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.3)',
        pointBackgroundColor: '#43A047',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#43A047',
      }
    ]
  };
    lineChartData2: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: '2025',
        fill: true,
        tension: 0.4,
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(15, 36, 230, 0.3)',
        pointBackgroundColor: '#43A047',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#43A047',
      }
    ]
  };
}
