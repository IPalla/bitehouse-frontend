import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../orders.service';
import { Kpis } from '../../kpis/kpis';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-kpis-pickup',
  templateUrl: './kpis-pickup.component.html',
  styleUrls: ['./kpis-pickup.component.css'],
  providers: [OrdersService]
})
export class KpisPickupComponent implements OnInit {
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
    selledProducts: [[]],
    mostSelledProduct: ''
  };
  everyTwentySeconds: Observable<number> = timer(0, 20000);
  twentySecondsSubscription: Subscription | undefined;
  topBurgers: any[] = this.getTopBurgers();
  width: number = 0;
  height: number = 0;
  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    window.resizeTo(1251, 907);
    window.focus();
    this.twentySecondsSubscription = this.everyTwentySeconds.subscribe((seconds) => {
      this.getKpis();
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
    this.getKpis();
  }

  getKpis(): void {
    this.ordersService.getKpis()
      .subscribe(kpis => {
        this.kpis = kpis;
        this.topBurgers = this.getTopBurgers();
      });
  }

  getTopBurgers(): any[] {
    var topBurgers = new Map();
    topBurgers.set('BACON CHEESEBURGER', { quantity: 0, src: this.getImgSrcFromBurgerName('BACON CHEESEBURGER') });
    topBurgers.set('SWEET SPICY BURGER', { quantity: 0, src: this.getImgSrcFromBurgerName('SWEET SPICY BURGER') });
    topBurgers.set('TRUFFLE BURGER', { quantity: 0, src: this.getImgSrcFromBurgerName('TRUFFLE BURGER') });
    topBurgers.set('MOJO ROJO CRUNCHY CHICKEN', { quantity: 0, src: this.getImgSrcFromBurgerName('MOJO ROJO CRUNCHY CHICKEN') });
    topBurgers.set('CRUNCHY CHICKEN BUN', { quantity: 0, src: this.getImgSrcFromBurgerName('CRUNCHY CHICKEN BUN') });
    topBurgers.set('PULLED PORK BURGER', { quantity: 0, src: this.getImgSrcFromBurgerName('PULLED PORK BURGER') });

    this.kpis.selledProducts.map((soldProduct: any) => {
      var product = topBurgers.get(soldProduct[0]);
      if (product) {
        product.quantity = soldProduct[1];
        topBurgers.set(soldProduct[0], product);
      }
    });
    return [...topBurgers.entries()].map(pr => {
      return {
        productName: pr[0],
        ...pr[1]
      }
    }).sort((pr1, pr2) => {
      return pr2.quantity - pr1.quantity;
    });
  }

  getImgSrcFromBurgerName(burgerName: string): string {
    switch (burgerName) {
      case 'BACON CHEESEBURGER':
        return '../../../assets/cheese-bacon-nobg2.png';
      case 'SWEET SPICY BURGER':
        return '../../../assets/sweet-spicy-nobg2.png';
      case 'TRUFFLE BURGER':
        return '../../../assets/truffle-nobg2.png';
      case 'MOJO ROJO CRUNCHY CHICKEN':
        return '../../../assets/mojo-rojo-nobg2.png';
      case 'CRUNCHY CHICKEN BUN':
        return '../../../assets/crunchy-chicken-nobg2.png';
      case 'PULLED PORK BURGER':
        return '../../../assets/pulled-pork-nobg2.png';
    }
    return '';
  }

}