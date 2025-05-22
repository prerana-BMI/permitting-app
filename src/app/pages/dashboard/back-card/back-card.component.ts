import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-back-card',
  templateUrl: './back-card.component.html',
  styleUrls: ['./back-card.component.scss']
})
export class BackCardComponent {
 @Input() front :boolean= false;
}
