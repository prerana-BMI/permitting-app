
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
import { catchError, filter, from, map, Observable, switchAll, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { Constants } from '../Models/Constants';
import { ToastrService } from 'ngx-toastr';

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
     private router: Router,
     private toastr: ToastrService,
    private HttpService : HttpService) {}



  // Step 6: Acquire and log access token
  getAccessToken(): Observable<string> {
  const account = this.msalService.instance.getActiveAccount();
  const request: SilentRequest = {
    scopes: ['user.read'],
    account: account!
  };

  return from(this.msalService.instance.acquireTokenSilent(request)).pipe(
    map((response: AuthenticationResult) => {
      const userData = {
        'UserName': account?.username,
        'Name': account?.name
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.accessToken);

      console.log('Access Token:', response.accessToken);
      return response.accessToken; // ✅ emit token
    }),
    catchError(error => {
      console.error("Silent token acquisition failed", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userDbDetails');

      if (error instanceof InteractionRequiredAuthError) {
        if (!this.msalService.instance.getActiveAccount()) {
          this.msalService.loginRedirect({ scopes: ['user.read'] });
        }
      }
      return throwError(() => error);
    })
  );
}

  GetLoggedInUser() {
    let user = localStorage.getItem('user');
    let role = localStorage.getItem('userDbDetails') ?? "";
    if (user != null && user != undefined) {
      this.User = JSON.parse(user);
      this.User['Role'] = JSON.parse(role)?.UserRole; 
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
  IsUserAuthorized(UserName : string ) {
      this.HttpService.httpPostCall(Constants.IsUserExist,JSON.stringify(UserName),true).subscribe((res:any)=>{
      if(res['Success'])
      { 
        let data = {
          'UserRole': res["Data"].UserRole,
        }
        localStorage.setItem('userDbDetails', JSON.stringify(data));
        this.router.navigate(['/permits/PermitHome']);
      }
      else{
        this.toastr.error('You are an unauthorized user,Please contact your help tesk team!');
        localStorage.removeItem('userDbDetails');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/account/login']);
      }
      })
  }
GetUserProfilePhoto(): Observable<string> {
  return this.getAccessToken().pipe(
    switchMap(token => {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/jpeg'
      };

      return this.HttpService.httpGetBlob(
        'https://graph.microsoft.com/v1.0/me/photo/$value',
        headers
      );
    }),
    switchMap(blob => new Observable<string>(observer => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = err => observer.error(err);
      reader.readAsDataURL(blob);
    }))
  );
}

}