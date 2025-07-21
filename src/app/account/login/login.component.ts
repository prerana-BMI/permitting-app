import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { LoaderService } from 'src/app/services/loader.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
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
 private router : Router,
  public appComponent: AppComponent
)
{

} 
ngOnInit(){
localStorage.removeItem('user');
localStorage.removeItem('token');

}
Login() {
  const activeAccount = this.msalService.instance.getActiveAccount();

  if (!activeAccount) {
    console.log("No active account, redirecting to Microsoft login...");
    this.msalService.loginRedirect({
      scopes: ['user.read']
    });
    return;
  }

  console.log("Active account found:", activeAccount);
  this.LoderService.display(true);
  this.authService.getAccessToken('');
  this.authService.IsUserAuthorized(activeAccount.username);
  this.LoderService.display(false);
}

 
}
