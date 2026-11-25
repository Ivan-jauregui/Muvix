import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStorageItemModalComponent } from './delete-storage-item-modal.component';

describe('DeleteStorageItemModalComponent', () => {
  let component: DeleteStorageItemModalComponent;
  let fixture: ComponentFixture<DeleteStorageItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteStorageItemModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteStorageItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
