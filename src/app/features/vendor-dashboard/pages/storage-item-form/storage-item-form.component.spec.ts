import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageItemFormComponent } from './storage-item-form.component';

describe('StorageItemFormComponent', () => {
  let component: StorageItemFormComponent;
  let fixture: ComponentFixture<StorageItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
