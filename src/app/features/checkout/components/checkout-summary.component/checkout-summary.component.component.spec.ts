import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSummaryComponentComponent } from './checkout-summary.component.component';

describe('CheckoutSummaryComponentComponent', () => {
  let component: CheckoutSummaryComponentComponent;
  let fixture: ComponentFixture<CheckoutSummaryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSummaryComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutSummaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
