import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Kpis,
  KpisAPIService,
  OrdersAPIService,
} from '../services/delivery-manager';
import * as moment from 'moment-timezone';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.css'],
  providers: [KpisAPIService],
})
export class KpisComponent implements OnInit, OnChanges {
  kpis: Kpis = {};
  private everyFiveSeconds: Observable<number> = timer(0, 5000);
  @Input() pickupScreen: boolean = false;
  @Input() selectedDate: Date | null = new Date();
  topBurgers: any[] = this.getTopBurgers();

  constructor(
    private kpisService: KpisAPIService,
    public ordersApiService: OrdersAPIService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getKpis();
    this.everyFiveSeconds.subscribe(() => {
      this.getKpis();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      console.log(`KPIS Component - Selected date: ${this.selectedDate}`);
      this.getKpis();
    }
  }

  getKpis(): void {
    this.kpisService
      .kpisGet(
        undefined,
        moment(this.selectedDate).format('YYYY-MM-DD'),
        moment(this.selectedDate).add(1, 'days').format('YYYY-MM-DD'),
      )
      .subscribe((kpis: Kpis) => {
        this.kpis = kpis;
        this.changeDetector.detectChanges();
      });
  }

  millisToMinutes(millis?: number): number {
    return millis && millis > 0 ? Math.floor(millis / 60000) : 0;
  }

  getTopBurgers(): any[] {
    var topBurgers = new Map();
    topBurgers.set('BACON CHEESEBURGER', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('BACON CHEESEBURGER'),
    });
    topBurgers.set('SWEET SPICY BURGER', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('SWEET SPICY BURGER'),
    });
    topBurgers.set('TRUFFLE BURGER', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('TRUFFLE BURGER'),
    });
    topBurgers.set('MOJO ROJO CRUNCHY CHICKEN', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('MOJO ROJO CRUNCHY CHICKEN'),
    });
    topBurgers.set('CRUNCHY CHICKEN BUN', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('CRUNCHY CHICKEN BUN'),
    });
    topBurgers.set('PULLED PORK BURGER', {
      quantity: 0,
      src: this.getImgSrcFromBurgerName('PULLED PORK BURGER'),
    });
    if (this.kpis.selledProducts) {
      this.kpis.selledProducts.map((soldProduct: any) => {
        var product = topBurgers.get(soldProduct[0]);
        if (product) {
          product.quantity = soldProduct[1];
          topBurgers.set(soldProduct[0], product);
        }
      });
    }
    return [...topBurgers.entries()]
      .map((pr) => {
        return {
          productName: pr[0],
          ...pr[1],
        };
      })
      .sort((pr1, pr2) => {
        return pr2.quantity - pr1.quantity;
      });
  }

  getInPreparationMoneyAmountStyle(): any {
    if (this.kpis.inPreparationMoneyAmount === undefined) return {};
    if (this.kpis.inPreparationMoneyAmount > 300)
      return { background: 'red', 'border-radius': '6px' };
    if (this.kpis.inPreparationMoneyAmount > 150)
      return { background: 'orange', 'border-radius': '6px' };
    return {};
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
