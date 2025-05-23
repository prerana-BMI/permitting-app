import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetpicturegridService {

private cameras: Camera[] = [
    {
      title: 'Camera #1',
      source: 'assets/images/camera1.jpg',
    },
    {
      title: 'Camera #2',
      source: 'assets/images/camera2.jpg',
    },
    {
      title: 'Camera #3',
      source: 'assets/images/camera3.jpg',
    },
    {
      title: 'Camera #4',
      source: 'assets/images/camera4.jpg',
    },
  ];

  getCamerasData(): Observable<Camera[]> {
    return of(this.cameras);
  }
}
export interface Camera {
  title: string;
  source: string;
}
