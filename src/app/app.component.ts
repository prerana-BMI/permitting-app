
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FormBuilder } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { Router, RouterModule } from '@angular/router';
import { LoaderService } from './services/loader.service';
@Component({
  selector: 'ngx-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
showLoader : boolean = false;
  constructor(private fb: FormBuilder,
      private auth : AuthService,
     private msalService: MsalService,
      private LoaerService : LoaderService,
    private router : Router) {
  }

async ngOnInit(): Promise<void> {
   this.LoaerService.status.subscribe((val: boolean) => {
      setTimeout(() => {
        this.showLoader = val;
      },0);
    });
    // Await redirect completion (this is critical)
    const result = await this.msalService.instance.handleRedirectPromise();

    if (result?.account) {
      this.msalService.instance.setActiveAccount(result.account);
      // this.auth.getAccessToken('');
      this.auth.IsUserAuthorized(result.account.username);
    } else {
      // fallback in case activeAccount is not set
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
      }
    }
  }

}
