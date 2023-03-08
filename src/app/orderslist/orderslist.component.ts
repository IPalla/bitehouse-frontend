import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Order } from './order';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css'],
  providers: [OrdersService]
})
export class OrderslistComponent implements OnInit {
  orders: Order[] = [];
  everyFiveSeconds: Observable<number> = timer(0, 5000);
  everyTwentySeconds: Observable<number> = timer(0, 20000);
  oneSecondSubscription: Subscription | undefined;
  twentySecondsSubscription: Subscription | undefined;
  ridersScreen: boolean = false;
  pickupScreen: boolean = false;
  kitchenScreen: boolean = false;
  constructor(private ordersService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.oneSecondSubscription = this.everyFiveSeconds.subscribe((seconds) => {
      this.orders = [...this.orders.map((ordr: Order) => {
        ordr.orderData.isDelayed = this.isDelayed(ordr);
        return ordr;
      })];
    });
    this.twentySecondsSubscription = this.everyTwentySeconds.subscribe((seconds) => {
      this.getOrders();
    });
    this.route.queryParams
      .subscribe(params => {
        this.kitchenScreen = false;
        this.ridersScreen = false;
        this.pickupScreen = false;
        if (params['screen'] && params['screen'] === 'riders') {
          this.ridersScreen = true;
        } else if (params['screen'] && params['screen'] === 'kitchen') {
          this.kitchenScreen = true;
        } else if (params['screen'] && params['screen'] === 'pickup') {
          this.pickupScreen = true;
        }
      }
      );
    this.getOrders();
  }

  getOrders(): void {
    this.ordersService.getOrders(false, false)
      .subscribe(orders => {
        console.log(orders);
        this.orders = orders.map((ordr: Order) => {
          ordr.orderData.parsedStatus = this.getParsedStatus(ordr);
          ordr.orderData.isDelayed = this.isDelayed(ordr);
          return ordr;
        });
        if (this.ridersScreen) {
          console.log('filtering');
          this.orders = this.orders.filter(this.onlyRidersOrders);
          this.orders.sort(this.sortByDescDate);
        } 
        else if (this.pickupScreen){
          this.orders = this.orders.filter(this.onlyPickupOrders);
          this.orders.sort(this.sortByDescDate);
        }
        else if (this.kitchenScreen){
          this.orders = this.orders.filter(this.onlyKitchenOrders);
          this.orders.sort(this.sortByDescDate);
        } else {
          this.orders.sort(this.sortByAscDate);
        }
      });
  }

  onlyRidersOrders(order: Order) {
    if (order.orderData.status === 90) {
      return false; // FINALISED ORDER
    }
    if (order.orderData.orderType === 1) {
      return false;
    }
    return true;
  }

  onlyKitchenOrders(order: Order) {
    if (order.orderData.status === 90) {
      return false; // FINALISED ORDER
    }
    return true;
  }

  onlyPickupOrders(order: Order) {
    if (order.orderData.status === 90) {
      return false; // FINALISED ORDER
    }
    if (order.orderData.orderType === 2) {
      return false;
    }
    return true;
  }

  sortByDescDate(ordr1: Order, ordr2: Order): number {
    var date1 = moment(ordr1.orderData.pickupTimeUpdated, 'DD/MM HH:mm');
    var date2 = moment(ordr2.orderData.pickupTimeUpdated, 'DD/MM HH:mm');
    if (date1.isBefore(date2)) {
      return -1;
    }
    if (date1.isAfter(date2)) {
      return 1;
    }
    return 0;
  }


  sortByAscDate(ordr1: Order, ordr2: Order): number {
    var date1 = moment(ordr1.orderData.pickupTimeUpdated, 'DD/MM HH:mm');
    var date2 = moment(ordr2.orderData.pickupTimeUpdated, 'DD/MM HH:mm');
    if (date1.isBefore(date2)) {
      return 1;
    }
    if (date1.isAfter(date2)) {
      return -1;
    }
    return 0;
  }

  navigateToDirection(order: Order): void {
    const address = order.orderData.deliveryAddress.source;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURI(address)}`, "_blank");
  }

  getParsedStatus(order: Order): any {
    switch (order.orderData.status) {
      // ACCEPTED
      case 20:
        return { status, text: 'ACCEPTED', literal: 'EN PREPARACIÓN', color: '#fddf7e', spinner: true, pickup: false, markAsDelivered: false };
      // READY FOR PICKUP
      case 70:
        return { status, text: 'READY FOR PICKUP', literal: 'LISTO PARA RECOGER', color: '#67ebfa', spinner: true, pickup: true, markAsDelivered: false };
      //IN DELIVERY 
      case 80:
        return { status, text: 'IN DELIVERY', literal: 'EN REPARTO', color: '#fddf7e', spinner: true, pickup: false, markAsDelivered: true };
      // FINALIZED
      case 90:
        return { status, text: 'FINALIZADO', literal: 'FINALIZADO', color: '#9bfbe1', spinner: false, pickup: false, markAsDelivered: false };
    }
    return { status, text: 'UNKNOWN', literal: 'ESTADO DESCONOCIDO', color: 'white', spinner: false, pickup: false, markAsDelivered: false };
  }

  isDelayed(order: Order): boolean {
    if (moment(order.orderData.pickupTimeUpdated, 'DD/MM HH:mm').isBefore(moment()) && (order.orderData.status === 20 || order.orderData.status === 70)) {
      return true;
    }
    return false;
  }

  markAsInDelivery(order: Order){
    this.updateOrderStatus(order.orderData.channelOrderDisplayId, 80);
  }

  markAsDelivered(order: Order){
    this.updateOrderStatus(order.orderData.channelOrderDisplayId, 90)
  }
  updateOrderStatus(orderId: string, status: number){
    this.ordersService.updateStatus(orderId, status)
    .subscribe(orders => {
      this.getOrders();
    });
  }
}
/**
 * Screens: cocina, riders, customers
 */