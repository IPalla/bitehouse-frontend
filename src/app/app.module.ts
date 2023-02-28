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

@NgModule({
  declarations: [
    AppComponent,
    KpisComponent,
    OrderslistComponent
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
