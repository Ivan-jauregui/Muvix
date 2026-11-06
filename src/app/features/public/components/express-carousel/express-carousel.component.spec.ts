import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressCarouselComponent } from './express-carousel.component';

describe('ExpressCarouselComponent', () => {
  let component: ExpressCarouselComponent;
  let fixture: ComponentFixture<ExpressCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
