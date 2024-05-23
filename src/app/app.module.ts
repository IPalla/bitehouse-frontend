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
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    KpisComponent,
    OrderslistComponent,
    PickupScreenComponent,
    DeliveryAppComponent,
    KpisPickupComponent,
    BarChartPickupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    HttpClientModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpErrorHandler,
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: "longDate" }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
