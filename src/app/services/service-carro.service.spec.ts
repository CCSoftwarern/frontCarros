import { TestBed } from '@angular/core/testing';

import { ServiceCarroService } from './service-carro.service';

describe('ServiceCarroService', () => {
  let service: ServiceCarroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCarroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
