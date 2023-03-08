import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private handleError: HandleError;
  ordersRoute: string;
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
    
    this.ordersRoute = 'http://localhost:8080'; //'https://whatsapp-trigger-j5lrm5ud3q-lm.a.run.app/orders';
  }

  getOrders(onlyPickup: boolean, onlyDelivery: boolean): Observable<any> {
    var ordersRoute = `${this.ordersRoute}/orders?day=${new Date().toISOString()}`;
    if (onlyDelivery){
      ordersRoute += `&only_delivery=true`;
    }
    if (onlyPickup){
      ordersRoute += `&only_pickup=true`;
    }
    return this.http.get(ordersRoute).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  getKpis(): Observable<any> {
    return this.http.get(`${this.ordersRoute}/kpis?day=${new Date().toISOString()}`).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  updateStatus(orderId: string, status: number): Observable<any> {
    return this.http.patch(`${this.ordersRoute}/order-update/${orderId}`, {status}).pipe(
      catchError(this.handleError('getHeroes', []))
    );;
  }

}