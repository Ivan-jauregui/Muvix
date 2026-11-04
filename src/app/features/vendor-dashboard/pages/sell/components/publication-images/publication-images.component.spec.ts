import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationImagesComponent } from './publication-images.component';

describe('PublicationImagesComponent', () => {
  let component: PublicationImagesComponent;
  let fixture: ComponentFixture<PublicationImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
