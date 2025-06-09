import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { LoaderService } from 'src/app/services/loader.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showLoader! : Boolean;
constructor(private authService : AuthService,
  private msalService: MsalService,
 private LoderService :LoaderService,
 private router : Router
)
{

} 
ngOnInit(){
localStorage.removeItem('user');
localStorage.removeItem('token');

}
Login()
{
this.LoderService.display(true);
const activeAccount = this.msalService.instance.getActiveAccount();

  if (!activeAccount) {
    this.msalService.loginRedirect({
      scopes: ['user.read']
    });
  } else {
    this.authService.getAccessToken('');
    this.authService.IsUserAuthorized(activeAccount.username);
  }
this.LoderService.display(false);
}
 
}
