import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublicationCardComponent } from './admin-publication-card.component';

describe('AdminPublicationCardComponent', () => {
  let component: AdminPublicationCardComponent;
  let fixture: ComponentFixture<AdminPublicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPublicationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPublicationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
