import { TestBed } from '@angular/core/testing';

import { Invitado } from './invitado';

describe('Invitado', () => {
  let service: Invitado;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invitado);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
