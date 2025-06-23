import { NgModule } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCardModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbListItemComponent, NbListModule, NbMenuModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbUserModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontCardComponent } from './dashboard/front-card/front-card.component';
import { NgChartsModule } from 'ng2-charts';

import { UiKittenComponent } from './dashboard/ui-kitten/ui-kitten.component';
import { SecurityCamerasComponent } from './dashboard/security-cameras/security-cameras.component';
import { WheatherDataComponent } from './dashboard/wheather-data/wheather-data.component';
import { BackCardComponent } from './dashboard/back-card/back-card.component';
import { PagelayoutModule } from '../pagelayout/pagelayout.module';
import { UserActivityComponent } from './dashboard/user-activity/user-activity.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
];
@NgModule({
  imports: [
    PagesRoutingModule,
    PagelayoutModule,
    NbMenuModule,
    NbCardModule,
    NgChartsModule,
    NbIconModule,
    NbActionsModule,
    NbButtonModule,
    ThemeModule,
    NbListModule,
     ...NB_MODULES
    
  ],
  declarations: [
    PagesComponent,DashboardComponent, FrontCardComponent, UiKittenComponent, SecurityCamerasComponent, WheatherDataComponent, BackCardComponent, UserActivityComponent
  ],
})
export class PagesModule {
}
