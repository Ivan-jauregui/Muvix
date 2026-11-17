import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectionModalComponent } from './item-selection-modal.component';

describe('ItemSelectionModalComponent', () => {
  let component: ItemSelectionModalComponent;
  let fixture: ComponentFixture<ItemSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
