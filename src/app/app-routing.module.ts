import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryAppComponent } from './delivery-app/delivery-app.component';
import { PickupScreenComponent } from './pickup-screen/pickup-screen.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'pickup-screen', component: PickupScreenComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: DeliveryAppComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
