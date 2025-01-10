import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { Order, OrdersAPIService, Status } from '../services/delivery-manager';
import { OrderNotification } from '../services/delivery-manager/model/orderNotification';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css'],
})
export class OrderslistComponent implements OnInit, OnChanges {
  orders: Order[] = [];
  ridersScreen: boolean = false;
  private everyFiveSeconds: Observable<number> = timer(0, 5000);

  @Input() pickupScreen: boolean = false;
  @Input() selectedFilter = 'Kitchen';
  @Input() selectedDate: Date | null = new Date();

  kitchenScreen: boolean = false;
  playing: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public ordersApiService: OrdersAPIService,
    public changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.subscribeToNotifications();
    this.getOrders();
    this.everyFiveSeconds.subscribe(() => {
      this.getOrders();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFilter'] || changes['selectedDate']) {
      console.log(`Selected filter: ${this.selectedFilter}`);
      console.log(`Selected date: ${this.selectedDate}`);
      this.filterOrders();
    }
  }

  subscribeToNotifications(): void {
    this.ordersApiService.getOrdersNotifications().subscribe(
      (data: OrderNotification) => {
        console.log(
          `Orders notifications received: ${new Date()} ${data.order?.id} - ${JSON.stringify(
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

  filterOrders() {
    if (this.selectedFilter === 'Kitchen' && !this.pickupScreen) {
      this.ridersScreen = false;
      this.kitchenScreen = true;
    } else if (this.selectedFilter === 'Riders' && !this.pickupScreen) {
      this.ridersScreen = true;
      this.kitchenScreen = false;
    }
    this.getOrders();
  }

  trackByOrderId(index: string, order: Order): string {
    return order.id || '';
  }

  playReadyAudio(order: Order) {
    console.log(`Play ready audio for order ${order.id}`);
    if (this.playing === true) {
      console.log(`Audio already playing, waiting 5 seconds to play`);
      setTimeout(() => {
        this.playReadyAudio(order);
      }, 5000);
      return;
    }
    const audio = new Audio(
      `https://whatsapp-trigger-j5lrm5ud3q-lm.a.run.app/orders/${order.id}/audio`,
    );
    this.playing = true;
    audio.play();
    audio.onended = () => {
      console.log(`Audio ended`);
      this.playing = false;
    };
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
        moment(this.selectedDate).format('YYYY-MM-DD'),
        moment(this.selectedDate).add(1, 'days').format('YYYY-MM-DD'),
      )
      .subscribe((orders) => {
        console.log(`Orders retrieved successfully`);
        if (this.ridersScreen || this.pickupScreen || this.kitchenScreen) {
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
          orders = orders.filter(
            (order) => order.status?.status !== Status.StatusEnum.DELIVERED,
          );
        }
        this.orders = [...orders];
        this.changeDetector?.detectChanges();
      });
  }
}
