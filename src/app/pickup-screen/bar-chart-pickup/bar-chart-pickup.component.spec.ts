import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartPickupComponent } from './bar-chart-pickup.component';

describe('BarChartPickupComponent', () => {
  let component: BarChartPickupComponent;
  let fixture: ComponentFixture<BarChartPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartPickupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
