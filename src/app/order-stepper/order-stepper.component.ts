/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Order, OrdersAPIService, Status } from '../services/delivery-manager';
import { ToolbarService } from '../services/toolbar.service';
import { Observable, timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

/**
 * @title Stepper animations
 */
@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.css'],
  standalone: true,
  imports: [
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
  ],
})
export class OrderStepperComponent implements OnInit {
  private orderId: any;
  public order: Order = {};
  private everyFifteenSeconds: Observable<number> = timer(0, 15000);

  constructor(
    private toolbarService: ToolbarService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    public ordersApiService: OrdersAPIService,
  ) {}
  currentStep: number = 0;
  stepDuration: number = 1000; // 10 seconds

  ngOnInit() {
    this.toolbarService.setVisibility(false); // Hide the toolbar
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['order_id'];
    });
    this.advanceStep();
    this.getOrder(this.orderId);
    this.everyFifteenSeconds.subscribe(() => {
      this.getOrder(this.orderId);
    });
  }

  ngOnDestroy() {
    this.toolbarService.setVisibility(true); // Show the toolbar when the component is destroyed
  }

  getOrder(orderId: any) {
    this.ordersApiService.ordersOrderIdGet(orderId).subscribe((data) => {
      this.order = data;
      this.advanceStep(this.getStep(data));
      console.log(
        `Order received: ${data.id} - ${JSON.stringify(data.status)}`,
      );
    });
  }

  instantToDate(instant?: number): string {
    return instant
      ? moment.unix(instant / 1000).format('HH:mm')
      : 'Calculando...';
  }

  getStep(order: Order): number {
    console.log(`Order status: ${order.status?.status}`);
    if (
      order.status?.status === Status.StatusEnum.PENDING ||
      order.status?.status === Status.StatusEnum.IN_PROGRESS
    ) {
      return 1;
    } else if (
      order.status?.status === Status.StatusEnum.PREPARED ||
      order.status?.status === Status.StatusEnum.READY
    ) {
      return this.isDeliveryOrder(order) ? 1 : 2;
    } else if (order.status?.status === Status.StatusEnum.IN_DELIVERY) {
      return 2;
    } else if (order.status?.status === Status.StatusEnum.DELIVERED) {
      return 3;
    }
    return 1;
  }

  isDeliveryOrder(order: Order): boolean {
    return order?.type === Order.TypeEnum.Delivery;
  }

  advanceStep(newStep: number = 0) {
    while (this.currentStep < 4 && this.currentStep < newStep) {
      this.currentStep++;
      this.changeDetector.detectChanges();
    }
  }
}
