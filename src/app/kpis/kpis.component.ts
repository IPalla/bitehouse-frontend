import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Kpis } from './kpis';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.css'],
  providers: [OrdersService]
})
export class KpisComponent implements OnInit {
  kpis: Kpis = {
    totalOrders: '0',
    inPreparationOrders: '0',
    averagePreparationTime: '0',
    minPreparationTime: '0',
    maxPreparationTime: '0',
    awaitingOrders: '0',
    averageAwaitingTime: '0',
    minAwaitingTime: '0',
    maxAwaitingTime: '0',
    inDeliveryOrders: '0',
    averageDeliveryTime: '0',
    minDeliveryTime: '0',
    maxDeliveryTime: '0',
    pickupOrders: '0',
    averageEndToEndTime: '0',
    minEndToEndTime: '0',
    maxEndToEndTime: '0',
    finishedOrders: '0',
    followers: 0,
    selledProducts: [],
    mostSelledProduct: ''
  };
  everyTwentySeconds: Observable<number> = timer(0, 20000);
  twentySecondsSubscription: Subscription | undefined;
  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.twentySecondsSubscription = this.everyTwentySeconds.subscribe((seconds) => {
      this.getKpis();
    });
    this.getKpis();
  }

  getKpis(): void {
    this.ordersService.getKpis()
      .subscribe(kpis => {
        this.kpis = kpis;
      });
  }

}
