import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private handleError: HandleError;
  ordersRoute: string;
  mainWpRoute: string;
  dineInWpRoute: string;
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
    this.ordersRoute = environment.ordersUrl; //'http://localhost:8080'; //'https://whatsapp-trigger-j5lrm5ud3q-lm.a.run.app/orders';
    this.mainWpRoute = 'https://www.bitehouseburger.es/wp-admin/admin.php?page=wc-status';
    this.dineInWpRoute = 'https://www.trescantos.pickup.bitehouseburger.es/wp-admin/admin.php?page=wc-status';
  }

  getOrders(onlyPickup: boolean, onlyDelivery: boolean): Observable<any> {
    var ordersRoute = `${this.ordersRoute}/orders?day=${new Date().toISOString()}`;
    console.log(`Get orders ${ordersRoute}`);
    if (onlyDelivery) {
      ordersRoute += `&only_delivery=true`;
    }
    if (onlyPickup) {
      ordersRoute += `&only_pickup=true`;
    }
    //this.execWpAsyncTasks().then(console.log).catch(console.log).then(console.log).catch(console.log);
    return this.http.get(ordersRoute).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  getOrderAudioUrl(orderId: string): string {
    return `${this.ordersRoute}/orders/${orderId}/audio`;
  }

  getKpis(): Observable<any> {
    return this.http.get(`${this.ordersRoute}/kpis?day=${new Date().toISOString()}`).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  updateStatus(orderId: string, status: number): Observable<any> {
    return this.http.patch(`${this.ordersRoute}/order-update/${orderId}`, { status }).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

  async execWpAsyncTasks(): Promise<any> {
    return Promise.all([
      this.http.get(this.mainWpRoute).toPromise(),
      this.http.get(this.dineInWpRoute).toPromise()
    ]);
  }

}