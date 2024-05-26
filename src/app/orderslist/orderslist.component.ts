import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  Order,
  OrdersAPIService,
  Status,
  StatusUpdate,
} from '../services/delivery-manager';
import { Observable, timer } from 'rxjs';
import { OrderNotification } from '../services/delivery-manager/model/orderNotification';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css'],
  providers: [OrdersAPIService],
})
export class OrderslistComponent implements OnInit {
  orders: Order[] = [];
  ridersScreen: boolean = false;
  pickupScreen: boolean = false;
  kitchenScreen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public ordersApiService: OrdersAPIService
  ) {}

  ngOnInit(): void {
    this.ordersApiService
      .getOrdersNotifications()
      .subscribe((data: OrderNotification) => {
        console.log(
          `Orders notifications received: ${data.order?.id} - ${JSON.stringify(
            data.events
          )}`
        );
        this.getOrders();
      });
    this.route.queryParams.subscribe((params) => {
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
    });
    this.getOrders();
  }

  getOrders(): void {
    var orderType: Order.TypeEnum[] = [
      Order.TypeEnum.Pickup,
      Order.TypeEnum.Dinein,
      Order.TypeEnum.Delivery,
    ];
    if (this.pickupScreen) {
      orderType = [Order.TypeEnum.Pickup, Order.TypeEnum.Dinein];
    }
    if (this.ridersScreen) {
      orderType = [Order.TypeEnum.Delivery];
    }
    this.ordersApiService
      .ordersGet(
        orderType,
        moment().format('YYYY-MM-DD'),
        moment().add(1, 'days').format('YYYY-MM-DD')
      )
      .subscribe((orders) => {
        console.log(`Orders retrieved!!`);
        if (this.ridersScreen || this.pickupScreen) {
          orders.sort((ordr1, ordr2) => {
            return ordr2.operation?.expectedReadyTs! - ordr1.operation?.expectedReadyTs!;
          });
        } else {
          orders.sort((ordr1, ordr2) => {
            return ordr1.operation?.expectedReadyTs! - ordr2.operation?.expectedReadyTs!;
          });
        }
        this.orders = orders || [];
      });
  }
}
