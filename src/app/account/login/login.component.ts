import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
ngOnInit(){
const spinner = document.getElementById('nb-global-spinner');
if (spinner) {
  spinner.style.display = 'none'; // or 'block' to show
}

}
}
