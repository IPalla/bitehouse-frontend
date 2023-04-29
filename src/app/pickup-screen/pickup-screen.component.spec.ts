import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupScreenComponent } from './pickup-screen.component';

describe('PickupScreenComponent', () => {
  let component: PickupScreenComponent;
  let fixture: ComponentFixture<PickupScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
