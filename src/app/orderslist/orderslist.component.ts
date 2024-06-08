import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { Order, OrdersAPIService, Status } from '../services/delivery-manager';
import { OrderNotification } from '../services/delivery-manager/model/orderNotification';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css'],
})
export class OrderslistComponent implements OnInit {
  orders: Order[] = [];
  ridersScreen: boolean = false;
  @Input() pickupScreen: boolean = false;
  kitchenScreen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public ordersApiService: OrdersAPIService,
    public changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subscribeToNotifications();
    this.route.queryParams.subscribe((params) => {
      this.kitchenScreen = false;
      this.ridersScreen = false;
      if (params['screen'] && params['screen'] === 'riders') {
        this.ridersScreen = true;
      } else if (params['screen'] && params['screen'] === 'kitchen') {
        this.kitchenScreen = true;
      }
    });
    this.getOrders();
  }

  subscribeToNotifications(): void {
    this.ordersApiService.getOrdersNotifications().subscribe(
      (data: OrderNotification) => {
        console.log(
          `Orders notifications received: ${data.order?.id} - ${JSON.stringify(
            data.events,
          )}`,
        );
        if (
          this.pickupScreen &&
          data.events?.find((event) => event === 'operation.order.ready') &&
          (data.order?.type === Order.TypeEnum.Pickup ||
            data.order?.type === Order.TypeEnum.Dinein)
        ) {
          console.log(`Playing audio for order ${data.order?.id}`);
          this.playReadyAudio(data.order);
        }
        this.getOrders();
      },
      (error) => {
        console.error(`Error subscribing to notifications: ${error}`);
        this.subscribeToNotifications();
      },
    );
  }

  trackByOrderId(index: string, order: Order): string {
    return order.id || '';
  }

  playReadyAudio(order: Order) {
    console.log(`Playing audio for order ${order.id}`);
    const audio = new Audio(
      `https://whatsapp-trigger-j5lrm5ud3q-lm.a.run.app/orders/${order.id}/audio`,
    );
    audio.play();
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
    console.log(`Getting orders for ${orderType}`);
    this.ordersApiService
      .ordersGet(
        orderType,
        moment().format('YYYY-MM-DD'),
        moment().add(1, 'days').format('YYYY-MM-DD'),
      )
      .subscribe((orders) => {
        console.log(`Orders retrieved successfully`);
        if (this.ridersScreen || this.pickupScreen) {
          orders.sort((ordr1, ordr2) => {
            return (
              ordr2.operation?.expectedReadyTs! -
              ordr1.operation?.expectedReadyTs!
            );
          });
        } else {
          orders.sort((ordr1, ordr2) => {
            return (
              ordr1.operation?.expectedReadyTs! -
              ordr2.operation?.expectedReadyTs!
            );
          });
        }
        
        if (this.ridersScreen) {
          orders = orders.filter((order) =>
            order.status?.status !== Status.StatusEnum.DELIVERED
          );
        }
        this.orders = [...orders];
        this.changeDetector?.detectChanges();
      });
  }
}
