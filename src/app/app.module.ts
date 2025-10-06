/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbMenuModule,
  NbSidebarModule,
  NbWindowModule,
} from '@nebular/theme';
import { PagelayoutModule } from './pagelayout/pagelayout.module';
import { PermitsModule } from './permits/permits.module';
import { ToastrModule } from 'ngx-toastr';
import { AccountModule } from './account/account.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MsalModule,
  MsalService,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalInterceptor,
  MsalGuard
} from '@azure/msal-angular';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';
import { MaterialModule } from './material/material.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '9be1e84f-4086-4fba-bd57-3a9a8447cdf9',
      authority: 'https://login.microsoftonline.com/bfbb9a2b-6d99-4e78-b3c7-95005d555c8b',
      redirectUri : 'https://permitappclientservice-cjabhxhnbybtc2cg.southcentralus-01.azurewebsites.net/'
     
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
    system: {
    loadFrameTimeout: 6000 // 10 seconds (default is 6000ms)
  }
  });
}

export function initializeMsalInstance(msalService: MsalService): () => Promise<void> {
  return () => firstValueFrom(msalService.initialize());  // MSAL v4+ requires this
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbWindowModule.forRoot(),
    ThemeModule.forRoot(),
    PagelayoutModule,
    PermitsModule,
    AccountModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),
    ReactiveFormsModule,
    FormsModule,
    MsalModule.forRoot(
      MSALInstanceFactory(),
      {
        interactionType: InteractionType.Redirect, // Required
        authRequest: {
          scopes: ['user.read']
        },
      },
      {
        interactionType: InteractionType.Redirect, // Optional for token acquisition
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
        ])
      }
    )
    
  ],
  providers: [MsalService, MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalInstance,
      deps: [MsalService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
