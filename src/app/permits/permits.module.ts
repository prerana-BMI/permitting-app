import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitsRoutingModule } from './permits-routing.module';
import { TruncateHoverPipe } from '../pipes/truncate-hover.pipe';
@NgModule({
  declarations: [TruncateHoverPipe 
  ],
  imports: [
    CommonModule,
    PermitsRoutingModule,
  
  ]
})
export class PermitsModule {}
