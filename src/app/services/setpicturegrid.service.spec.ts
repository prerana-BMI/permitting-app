import { TestBed } from '@angular/core/testing';

import { SetpicturegridService } from './setpicturegrid.service';

describe('SetpicturegridService', () => {
  let service: SetpicturegridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetpicturegridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
