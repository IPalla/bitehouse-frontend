import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { KpisComponent } from './kpis/kpis.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { OrderslistComponent } from './orderslist/orderslist.component';
import {MaterialExampleModule} from './material.module';
import { PickupScreenComponent } from './pickup-screen/pickup-screen.component';
import { DeliveryAppComponent } from './delivery-app/delivery-app.component';
import { KpisPickupComponent } from './pickup-screen/kpis-pickup/kpis-pickup.component';
import { BarChartPickupComponent } from './pickup-screen/bar-chart-pickup/bar-chart-pickup.component';

@NgModule({
  declarations: [
    AppComponent,
    KpisComponent,
    OrderslistComponent,
    PickupScreenComponent,
    DeliveryAppComponent,
    KpisPickupComponent,
    BarChartPickupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    HttpClientModule,
    MaterialExampleModule
  ],
  providers: [
    HttpErrorHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
