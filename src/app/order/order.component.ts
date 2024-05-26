import { Component, Input } from '@angular/core';
import { Order, OrdersAPIService, Status } from '../services/delivery-manager';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  @Input() order: Order | undefined;
  @Input() getOrders: () => void = () => {};
  @Input() ordersApiService: OrdersAPIService | undefined;
  public saveInProgress: boolean = false;

  constructor(public dialog: MatDialog) {
    this.saveInProgress = false;
  }

  ngOnInit(): void {}

  navigateToDirection(): void {
    const address = this.order?.customer?.address || '';
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURI(address)}`,
      '_blank'
    );
  }

  isDelayed(): boolean {
    const currentTimestamp = new Date().getTime();
    if (
      this.order?.status?.status === Status.StatusEnum.IN_PROGRESS ||
      this.order?.status?.status === Status.StatusEnum.PENDING
    ) {
      return (
        currentTimestamp > (this.order?.operation?.expectedReadyTs ?? 0) || false
      );
    }
    if (
      this.order?.status?.status === Status.StatusEnum.IN_DELIVERY ||
      this.order?.status?.status === Status.StatusEnum.READY
    ) {
      return (
        currentTimestamp > (this.order?.operation?.expectedDeliveredTs ?? 0) || false
      );
    }
    return false;
  }

  instantToDate(instant?: number): string {
    return instant ? moment.unix(instant / 1000).format('HH:mm') : '';
  }

  markAsInDelivery() {
    this.updateOrderStatus(this.order?.id, Status.StatusEnum.IN_DELIVERY);
  }

  markAsDelivered() {
    this.updateOrderStatus(this.order?.id, Status.StatusEnum.DELIVERED);
  }

  updateOrderStatus(orderId?: string, status?: Status.StatusEnum) {
    if (!orderId){
      return;
    }
    this.saveInProgress = true;
    var promise: Promise<GeolocationPosition> = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(`Geo position acquired: ${JSON.stringify(position)}`);
        resolve(position);
      });
    });
    promise.then((position: GeolocationPosition) => {
      this?.ordersApiService
        ?.ordersOrderIdPatch(position?.coords?.latitude, position?.coords?.longitude, orderId, { status })
        .subscribe((response) => {
          this.saveInProgress = false;
          this.getOrders();
        });
    });
  }

  recogerButtonVisible(): boolean {
    return (
      this.order?.type === Order.TypeEnum.Delivery &&
      (this.order?.status?.status === Status.StatusEnum.READY ||
        this.order?.status?.status === Status.StatusEnum.PREPARED)
    );
  }

  entregarButtonVisible(): boolean {
    return this.order?.status?.status === Status.StatusEnum.IN_DELIVERY;
  }
  getOrderStyle(): object {
    var background = '#fddf7e';
    switch (this.order?.status?.status) {
      case Status.StatusEnum.IN_PROGRESS:
      case Status.StatusEnum.PENDING:
      case Status.StatusEnum.IN_DELIVERY:
        background = '#fddf7e';
        break;
      case Status.StatusEnum.PREPARED:
      case Status.StatusEnum.READY:
        background =
          this.order.type === Order.TypeEnum.Delivery ? '#67ebfa' : '#9bfbe1';
        break;
      case Status.StatusEnum.DELIVERED:
        background = '#9bfbe1';
        break;
    }
    if (this.saveInProgress)
      return {
        'pointer-events': 'none',
        'background': 'white'
      };
    return { background };
  }
  containsShakes() {
    return this.order?.items?.find((item) => item?.name?.includes('SHAKE')) != null;
  }

  containsCakes() {
    return this.order?.items?.find((item) => item?.name?.includes('CAKE')) != null;
  }

  containsDrinks() {
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
      this.order?.items?.find((item) => drinksRegex.test(item?.name || '')) != null
    );
  }

  hideSpinner(): boolean {
    if (this.saveInProgress){
      return false;
    }
    return (
      this.order?.status?.status === Status.StatusEnum.DELIVERED ||
      ((this.order?.status?.status === Status.StatusEnum.PREPARED ||
        this.order?.status?.status === Status.StatusEnum.PREPARED) &&
        this.order?.type !== Order.TypeEnum.Delivery)
    );
  }

  openOrderDialogInfo() {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '250px',
      data: this.order,
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
