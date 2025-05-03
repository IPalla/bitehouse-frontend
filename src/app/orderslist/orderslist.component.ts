import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { Order, OrdersAPIService, Status } from '../services/delivery-manager';
import { OrderNotification } from '../services/delivery-manager/model/orderNotification';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css'],
})
export class OrderslistComponent implements OnInit, OnChanges, OnDestroy {
  orders: Order[] = [];
  previousOrders: { [id: string]: Order } = {};
  ridersScreen: boolean = false;
  private everyFiveSeconds: Observable<number> = timer(0, 5000);
  private timerSubscription: Subscription | null = null;

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
    this.getOrders();
    this.timerSubscription = this.everyFiveSeconds.subscribe(() => {
      this.getOrders();
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFilter'] || changes['selectedDate']) {
      console.log(`Selected filter: ${this.selectedFilter}`);
      console.log(`Selected date: ${this.selectedDate}`);
      this.filterOrders();
    }
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
    const audio = new Audio('assets/sounds/order-ready.mp3');
    this.playing = true;
    audio.play();
    audio.onended = () => {
      console.log(`Audio ended`);
      this.playing = false;
    };
  }

  isOrderReady(order: Order): boolean {
    return order.status?.status === Status.StatusEnum.READY;
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
            (order) =>
              order.status?.status !== Status.StatusEnum.DELIVERED &&
              order.channel !== Order.ChannelEnum.Glovo,
          );
        }

        // Check for newly ready orders
        if (this.pickupScreen) {
          for (const order of orders) {
            if (!order.id) continue;

            const previousOrder = this.previousOrders[order.id];
            if (
              this.isOrderReady(order) &&
              previousOrder &&
              !this.isOrderReady(previousOrder) &&
              (order.type === Order.TypeEnum.Pickup ||
                order.type === Order.TypeEnum.Dinein)
            ) {
              console.log(`Order ${order.id} is now ready, playing audio`);
              this.playReadyAudio(order);
            }

            // Update previous order status
            this.previousOrders[order.id] = { ...order };
          }
        }

        this.orders = [...orders];
        this.changeDetector?.detectChanges();
      });
  }
}
