/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AulaService } from './aula.service';

describe('Service: Aula', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AulaService]
    });
  });

  it('should ...', inject([AulaService], (service: AulaService) => {
    expect(service).toBeTruthy();
  }));
});
