
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
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private HttpService : HttpService,
    private http: HttpClient) {}

  getAccessToken(): Observable<string> {
  const account = this.msalService.instance.getActiveAccount();
  const request: SilentRequest = {
    scopes: ['user.read' , 'mail.send'],
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
      return response.accessToken;
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
      if (role) {
        this.User['Role'] = JSON.parse(role)?.UserRole;
      }
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
  IsUserAuthorized(UserName: string,RedirectedFromLogin :boolean) {
   
    this.HttpService.httpPostCall(Constants.IsUserExist, JSON.stringify(UserName), true).subscribe((res: any) => {
      if (res['Success']) {
        let data = {
          'UserRole': res["Data"].UserRole,
        }
        localStorage.setItem('userDbDetails', JSON.stringify(data));
        this.router.navigate(['/permits/PermitHome']);
      }
      else {
        
        localStorage.removeItem('userDbDetails');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/account/login']);
        const createdOn = new Date(res['Data']?.LastLoginDate);
        const diffMs = (new Date().getTime() - createdOn.getTime()) / (1000 * 60 * 60 * 24);
        if (RedirectedFromLogin && res['Data'].IsActive  != true) {
          this.SendMailUsingGraph(
            Constants.AdminUser,
            `Permit application Access Requested by ${UserName}`,
            `User <b>${UserName}</b> tried to login at ${new Date().toLocaleString()}.<br><br>
   Kindly use the given URL to provide an Access of permit application:
   <a href="https://permitappclientservice-cjabhxhnbybtc2cg.southcentralus-01.azurewebsites.net/">
     Open Permit Application
   </a>`).subscribe();
          
        }  
        this.toastr.success('Your access request has been submitted successfully');
        
      }
    })
  
}
GetUserProfilePhoto(): Observable<string> {
  return this.getAccessToken().pipe(
    switchMap(token => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: headers,
        responseType: 'blob'
      });
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

SendMailUsingGraph(to: string, subject: string, body: string) {
  return this.getAccessToken().pipe(
    switchMap(token => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const payload = {
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: body
          },
          toRecipients: [
            { emailAddress: { address: to } }
          ]
        },
        saveToSentItems: true
      };

      return this.http.post(
        'https://graph.microsoft.com/v1.0/me/sendMail',
        payload,
        { headers }
      );
    })
  );
}
  
}
