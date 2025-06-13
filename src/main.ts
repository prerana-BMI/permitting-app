/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as L from 'leaflet';
L.Icon.Default.imagePath = 'assets/leaflet/images/';



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
