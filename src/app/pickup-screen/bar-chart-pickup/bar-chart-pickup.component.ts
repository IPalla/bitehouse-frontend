import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../orders.service';
import { Order } from '../../orderslist/order';
import * as moment from 'moment';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-bar-chart-pickup',
  templateUrl: './bar-chart-pickup.component.html',
  styleUrls: ['./bar-chart-pickup.component.css'],
  providers: [OrdersService]
})
export class BarChartPickupComponent implements OnInit {
  orders: Order[] = [];
  everyFiveSeconds: Observable<number> = timer(0, 5000);
  everyTwentySeconds: Observable<number> = timer(0, 5000);
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
        this.compareOrdersAndPlayAudios(orders, this.orders);
        this.orders = orders.map((ordr: Order) => {
          ordr.orderData.parsedStatus = this.getParsedStatus(ordr);
          ordr.orderData.isDelayed = this.isDelayed(ordr);
          ordr.txt = ordr.orderData.orderType === 2 ? 'DELIVERY' : ordr.orderData.orderType === 3 ? 'KIOSKO' : 'PICKUP';
          return ordr;
        });
        this.orders = this.orders.filter(this.onlyPickupOrders);
        this.orders.sort(this.sortByAscDate);
      });
  }
  compareOrdersAndPlayAudios(newOrders: any, currentOrders: Order[]) {
    newOrders.forEach((ordr: any) => {
      if (ordr.orderData.status === 70) {
        console.log(`Comparing order ${ordr.orderData.channelOrderDisplayId}`);
        const orderInPreviousState = currentOrders.find(order=>{
          return order.orderData.channelOrderDisplayId === ordr.orderData.channelOrderDisplayId;
        });
        console.log(`Order found ${orderInPreviousState?.orderData.status}`);
        if (orderInPreviousState !== undefined && orderInPreviousState.orderData.status === 20 && ordr.orderData.status === 70){
          console.log(`Playinh audio`);
          this.playReadyAudio(ordr);
        }
      }
    });
  }

  onlyPickupOrders(order: Order) {
    if (order.orderData.orderType === 1 || order.orderData.orderType === 3) {
      return true;
    }
    return false;
  }

  playReadyAudio(order: Order) {
    const audio = new Audio(this.ordersService.getOrderAudioUrl(order.orderData.channelOrderDisplayId));
    audio.play();
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

  getParsedStatus(order: Order): any {
    switch (order.orderData.status) {
      // ACCEPTED
      case 20:
        return { status, text: 'ACCEPTED', literal: 'EN PREPARACIÓN', color: '#fddf7e', spinner: true, pickup: false, markAsDelivered: false };
      // READY FOR PICKUP
      case 70:
        return { status, text: 'READY FOR PICKUP', literal: 'LISTO PARA RECOGER', color: order.orderData.orderType === 2 ? '#67ebfa' : '#9bfbe1', spinner: order.orderData.orderType === 2 ? true : false, pickup: true, markAsDelivered: false };
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
}
