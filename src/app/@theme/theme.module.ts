import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {FooterComponent} from '../@theme/components/footer/footer.component';
import {HeaderComponent} from '../@theme/components/header/header.component';
import {SearchInputComponent} from '../@theme/components/search-input/search-input.component';
import {CapitalizePipe} from '../@theme/pipes/capitalize.pipe';
import {PluralPipe} from '../@theme/pipes/plural.pipe';
import {RoundPipe} from '../@theme/pipes/round.pipe';
import {TimingPipe} from '../@theme/pipes/timing.pipe';
import {NumberWithCommasPipe} from '../@theme/pipes/number-with-commas.pipe';
import {DEFAULT_THEME } from './styles/theme.default';
import { LayoutComponent } from './components/layout/layout.component';
// import { COSMIC_THEME } from './styles/theme.cosmic';
// import { CORPORATE_THEME } from './styles/theme.corporate';
// import { DARK_THEME } from './styles/theme.dark';

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
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  LayoutComponent
 
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...(NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [DEFAULT_THEME,
            // COSMIC_THEME, CORPORATE_THEME, DARK_THEME
          ],
        ).providers ?? []),
      ],

    };
  }
}
