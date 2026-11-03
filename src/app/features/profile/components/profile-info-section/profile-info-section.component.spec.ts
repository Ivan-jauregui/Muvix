import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfoSectionComponent } from './profile-info-section.component';

describe('ProfileInfoSectionComponent', () => {
  let component: ProfileInfoSectionComponent;
  let fixture: ComponentFixture<ProfileInfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInfoSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
