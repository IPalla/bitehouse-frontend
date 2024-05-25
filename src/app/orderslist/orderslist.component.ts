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
import { Order, OrdersAPIService, Status, StatusUpdate } from '../services/delivery-manager';
import { Observable, timer } from 'rxjs';

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
  everyFiveSeconds: Observable<number> = timer(0, 5000);
  constructor(private route: ActivatedRoute, public dialog: MatDialog, 
    private ordersApiService: OrdersAPIService) {}

  ngOnInit(): void {
    this.everyFiveSeconds.subscribe((seconds) => {
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
    this.ordersApiService.ordersGet().subscribe((orders) => {
      console.log(`ORders retrieved!!`);
      console.log(JSON.stringify(orders));
      this.orders = orders || [];
    });
    /*
    this.ordersService.getOrders(false, false).subscribe((orders) => {
      this.orders = orders.map((ordr: Order) => {
        ordr.orderData.parsedStatus = this.getParsedStatus(ordr);
        ordr.orderData.isDelayed = this.isDelayed(ordr);
        ordr.txt = ordr.orderData.orderType === 2 ? 'DELIVERY' : 'PICKUP';
        return ordr;
      });
      if (this.ridersScreen) {
        this.orders = this.orders.filter(this.onlyRidersOrders);
        this.orders.sort(this.sortByDescDate);
      } else if (this.pickupScreen) {
        this.orders = this.orders.filter(this.onlyPickupOrders);
        this.orders.sort(this.sortByDescDate);
      } else if (this.kitchenScreen) {
        this.orders = this.orders.filter(this.onlyKitchenOrders);
        this.orders.sort(this.sortByDescDate);
      } else {
        this.orders.sort(this.sortByAscDate);
      }
    });*/
  }

  navigateToDirection(order: Order): void {
    const address = order?.customer?.address || '';
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURI(address)}`,
      '_blank'
    );
  }

  isDelayed(order: Order): boolean {
    const currentTimestamp = new Date().getTime();
    if (order?.status?.status === Status.StatusEnum.IN_PROGRESS) {
      return currentTimestamp > (order?.operation?.expectedReadyTs ?? 0) || false;
    }
    if (order?.status?.status === Status.StatusEnum.IN_DELIVERY || order?.status?.status === Status.StatusEnum.READY) {
      return currentTimestamp > (order?.operation?.expectedDeliveryTs ?? 0) || false;
    } 
    return false;
  }

  instantToDate(instant?: number): string {
    return instant ? moment.unix(instant/1000).format('HH:mm') : '';
  }

  markAsInDelivery(order: Order) {
    this.updateOrderStatus(order?.id, Status.StatusEnum.IN_DELIVERY);
  }

  markAsDelivered(order: Order) {
    this.updateOrderStatus(order?.id, Status.StatusEnum.DELIVERED);
  }
  updateOrderStatus(orderId?: string, status?: Status.StatusEnum) {
    if (orderId) {
      this.ordersApiService.ordersOrderIdPatch('', '', orderId, {status}).subscribe((orders) => {
        this.getOrders();
      });
    }
  }
  recogerButtonVisible(order: Order): boolean {
    return order.type === Order.TypeEnum.Delivery &&
      (order.status?.status === Status.StatusEnum.READY || order.status?.status === Status.StatusEnum.PREPARED);
  }

  entregarButtonVisible(order: Order): boolean {
    return order.status?.status === Status.StatusEnum.IN_DELIVERY;
  }
  getBackgroundColorFromOrder(order: Order): object {
    var background = '#fddf7e';
    switch (order?.status?.status) {
      case Status.StatusEnum.IN_PROGRESS:
      case Status.StatusEnum.PENDING:
      case Status.StatusEnum.IN_DELIVERY:
        background = '#fddf7e';
        break;
      case Status.StatusEnum.PREPARED:
      case Status.StatusEnum.READY:
        background =
          order.type === Order.TypeEnum.Delivery ? '#67ebfa' : '#9bfbe1';
        break;
      case Status.StatusEnum.DELIVERED:
        background = '#9bfbe1';
        break;
    }
    return { background };
  }
  containsShakes(order: Order) {
    return order?.items?.find((item) => item?.name?.includes('SHAKE')) != null;
  }

  containsCakes(order: Order) {
    return order?.items?.find((item) => item?.name?.includes('CAKE')) != null;
  }

  containsDrinks(order: Order) {
    var drinks = [
      'NESTEA',
      'COCA COLA',
      'FANTA',
      'AQUARIUS',
      'CERVEZA',
      'SPRITE',
    ];
    var drinksRegex = new RegExp(drinks.join('|'));
    return (
      order?.items?.find((item) => drinksRegex.test(item?.name || '')) != null
    );
  }
  openOrderDialogInfo(order: Order) {
    /*var promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      });
    });
    promise.then(console.log);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: order,
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
    */
  }
}

/*
@Component({
  selector: 'dialog-overview-example-dialog',
  styleUrls: ['./order.dialog.css'],
  templateUrl: './order.dialog.html',
  standalone: true,
  imports: [MatCardModule, CommonModule],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  callToCustomer(order: Order): void {
    location.href = `tel:${order?.customer?.phoneNumber}`;
  }

  callToRider(order: Order): void {
    location.href = `tel:${order?.rider?.phone}`;
  }

  dateToString(timestamp?: number): string {
    return `date: ${timestamp}`
  }

  diffDates(date1: string, date2: string): number {
    return (
      moment(date1, 'DD/MM HH:mm').diff(moment(date2, 'DD/MM HH:mm')) /
      (1000 * 60)
    );
  }

  getDeliveredTime(order: Order): string {
    return this.dateToString(
      (order?.operation?.createdTs ?? 0) +
        (order?.operation?.kitchenTime ?? 0) +
        (order?.operation?.inDeliveryTime ?? 0)
    );
  }

  getReadyTime(order: Order): string {
    return this.dateToString(
      (order?.operation?.createdTs ?? 0) +
        (order?.operation?.kitchenTime ?? 0)
    );
  }
}
*/