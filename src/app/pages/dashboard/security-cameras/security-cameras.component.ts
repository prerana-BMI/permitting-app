import { Component } from '@angular/core';
import { NbComponentSize, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import {Camera, SetpicturegridService } from 'src/app/services/setpicturegrid.service';


@Component({
  selector: 'app-security-cameras',
  templateUrl: './security-cameras.component.html',
  styleUrls: ['./security-cameras.component.scss']
})
export class SecurityCamerasComponent {
 private destroy$ = new Subject<void>();

  cameras!: Camera[];
  selectedCamera!: Camera;
  isSingleView = false;
  actionSize: NbComponentSize = 'medium';

  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private securityCamerasService: SetpicturegridService,
    
  ) {}

  ngOnInit() {
    this.securityCamerasService.getCamerasData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cameras: Camera[]) => {
        this.cameras = cameras;
        this.selectedCamera = this.cameras[0];
      });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }
}
