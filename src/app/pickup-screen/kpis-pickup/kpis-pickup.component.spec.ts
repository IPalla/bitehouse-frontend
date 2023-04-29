import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisPickupComponent } from './kpis-pickup.component';

describe('KpisPickupComponent', () => {
  let component: KpisPickupComponent;
  let fixture: ComponentFixture<KpisPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisPickupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpisPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
