
import { Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionRequiredAuthError,
  InteractionStatus,
  SilentRequest
} from '@azure/msal-browser';
import { filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  account!: any;
  AccessToken : string = '';
  User : any;

  constructor(private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
     private router: Router) {}

//  async loginSilently() {
//  console.log('[MSAL] Init: Starting login flow...');

//   // Step 0: Handle redirect if returning from Microsoft login
//   const redirectResult = await this.msalService.instance.handleRedirectPromise();
//   if (redirectResult !== null && redirectResult.account) {
//     console.log('[MSAL] Redirect result: Setting active account:', redirectResult.account);
//     this.msalService.instance.setActiveAccount(redirectResult.account);
//   }
//   let dataCountacc = this.msalService.instance.getActiveAccount();
//   if (!dataCountacc) {
//     const accounts = this.msalService.instance.getAllAccounts();
//     if (accounts.length > 0) {
//       console.log('[MSAL] Setting first available account as active.');
//       this.msalService.instance.setActiveAccount(accounts[0]);
//     }
//   }

//   // Step 1: Listen to MSAL login success
//   this.msalBroadcastService.msalSubject$
//   .pipe(
//   filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
//   ).subscribe((message: EventMessage) => {
//     if (message.eventType === EventType.LOGIN_SUCCESS && message.payload) {
//       const result = message.payload as AuthenticationResult;
//       console.log('[MSAL] LOGIN_SUCCESS event received. Account:', result.account);
//       this.msalService.instance.setActiveAccount(result.account);
//       this.getAccessToken(result.account?.username || '');
//     }
//   });

//   // Step 3: Check if there's an active account
//       let account = this.msalService.instance.getActiveAccount();
//       if (account) {
//         //console.log('[MSAL] Existing session found. Using account:', account.username);
//         this.getAccessToken(account.username);
//       } else {
//         console.log('[MSAL] No session found. Redirecting for login...');
//         this.msalService.loginRedirect({ scopes: ['user.read'] });
//       }
    
 
// }


  // Step 6: Acquire and log access token
  getAccessToken(username: string) {
    const accounts = this.msalService.instance.getActiveAccount();
    const request: SilentRequest = {
      scopes: ['user.read'], // Change scopes based on your API
      account: accounts!
    };
    this.msalService.instance.acquireTokenSilent(request)
      .then((response: AuthenticationResult) => {
        const userData = {
          'UserName' : accounts?.username,
          'Name' : accounts?.name
        }
        localStorage.setItem('user'  ,JSON.stringify(userData));
        localStorage.setItem('token' ,response.accessToken);
       console.log('Access Token:', response.accessToken); // ✅ Log token

      })
      .catch(error => {
         localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.msalService.loginRedirect({
          scopes: ['user.read']
        });
        // Fallback to redirect if needed
        //this.msalService.loginRedirect();
      });
  }
  GetLoggedInUser() {
    let user = localStorage.getItem('user');
    if (user != null && user != undefined) {
      this.User = JSON.parse(user);
      return this.User;

    }
  }
    GetLocalStorageToken() {
    let token = localStorage.getItem('token');
    if (token != null && token != undefined) {
     this.AccessToken = token;
    
     }
      return this.AccessToken
  }
}