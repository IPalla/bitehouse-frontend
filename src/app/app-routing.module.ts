import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryAppComponent } from './delivery-app/delivery-app.component';
import { PickupScreenComponent } from './pickup-screen/pickup-screen.component';
import { OrderStepperComponent } from './order-stepper/order-stepper.component';
import { LoginComponent } from './login/login.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

const routes: Routes = [
  { path: 'order-stepper', component: OrderStepperComponent },
  { path: 'pickup-screen', component: PickupScreenComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: DeliveryAppComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class AppRoutingModule {}
