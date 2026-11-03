import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDataComponent } from './pickup-data.component';

describe('PickupDataComponent', () => {
  let component: PickupDataComponent;
  let fixture: ComponentFixture<PickupDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
