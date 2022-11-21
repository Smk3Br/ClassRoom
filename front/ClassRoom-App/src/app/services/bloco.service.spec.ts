/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BlocoService } from './bloco.service';

describe('Service: Bloco', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlocoService]
    });
  });

  it('should ...', inject([BlocoService], (service: BlocoService) => {
    expect(service).toBeTruthy();
  }));
});
