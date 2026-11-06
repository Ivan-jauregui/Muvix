import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCtaComponent } from './seller-cta.component';

describe('SellerCtaComponent', () => {
  let component: SellerCtaComponent;
  let fixture: ComponentFixture<SellerCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
