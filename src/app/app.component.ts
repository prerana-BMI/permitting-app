
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
  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private msalService: MsalService,
    private LoaerService: LoaderService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.LoaerService.status.subscribe((val: boolean) => {
      setTimeout(() => {
        this.showLoader = val;
      }, 0);
    });

    await this.msalService.instance.handleRedirectPromise();

    const activeAccount = this.msalService.instance.getActiveAccount();

    if (activeAccount) {
      this.auth.IsUserAuthorized(activeAccount.username , false);
    } else {
      const allAccounts = this.msalService.instance.getAllAccounts();
      if (allAccounts.length > 0) {
        this.msalService.instance.setActiveAccount(allAccounts[0]);
        this.auth.IsUserAuthorized(allAccounts[0].username , false);
      }
    }
  }
}
