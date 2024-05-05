import { TestBed } from '@angular/core/testing';

import { SampleShopFormService } from './sample-shop-form.service';

describe('SampleShopFormServiceService', () => {
  let service: SampleShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
