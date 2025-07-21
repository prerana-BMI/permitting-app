import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { filter, take, map, Observable } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class activeauthGuard implements CanActivate {
  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  canActivate(): boolean {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
          return true;
        } else {
          this.router.navigate(['/account/login']);
          return false;
        }
  
  }
}
