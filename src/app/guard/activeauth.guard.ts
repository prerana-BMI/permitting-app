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
    // return this.broadcastService.inProgress$.pipe(
    //   filter(status => status === InteractionStatus.None),
    //   take(1),
    //   map(() => {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
          return true;
        } else {
          this.router.navigate(['/account/login']);
          return false;
        }
    //   })
    // );
  }
}

// activeauth.guard.ts
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { MsalService } from '@azure/msal-angular';

// export const activeauthGuard: CanActivateFn = () => {
//   const msalService = inject(MsalService);
//   const router = inject(Router);

//   const activeAccount = msalService.instance.getActiveAccount();
//   const allAccounts = msalService.instance.getAllAccounts();

//   if (activeAccount || allAccounts.length > 0) {
//     // If no activeAccount, set the first one
//     if (!activeAccount && allAccounts.length > 0) {
//       msalService.instance.setActiveAccount(allAccounts[0]);
//     }
//     return true;
//   } else {
//     router.navigate(['/account/login']); // change path if needed
//     return false;
//   }
// };
