import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MsalGuard } from '@azure/msal-angular';
import { activeauthGuard } from './guard/activeauth.guard';
import { PagesComponent } from './pages/pages.component';


export const routes: Routes = [ 
 {
    path: 'pages',
    canActivate: [activeauthGuard],
    loadChildren: () => import('./pages/pages.module')
    .then(m => m.PagesModule),
  },
  {
    path: 'permits',
    canActivate: [activeauthGuard],
    loadChildren: () => import('./permits/permits.module')
    .then(m => m.PermitsModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module')
    .then(m => m.AccountModule),
  },


];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    initialNavigation: 'enabledNonBlocking'  // For MSAL redirect flow
  }),

  ],
  exports: [RouterModule],
  
})
export class AppRoutingModule {
}
