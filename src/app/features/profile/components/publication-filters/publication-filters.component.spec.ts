import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationFiltersComponent } from './publication-filters.component';

describe('PublicationFiltersComponent', () => {
  let component: PublicationFiltersComponent;
  let fixture: ComponentFixture<PublicationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
