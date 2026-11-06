import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationCarrouselComponent } from './publication-carrousel.component';

describe('PublicationCarrouselComponent', () => {
  let component: PublicationCarrouselComponent;
  let fixture: ComponentFixture<PublicationCarrouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationCarrouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
