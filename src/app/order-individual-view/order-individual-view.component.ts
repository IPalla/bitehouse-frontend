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
import { ChangeDetectorRef } from '@angular/core';
import { OrderComponent } from '../order/order.component';

/**
 * @title Stepper animations
 */
@Component({
  selector: 'app-order-individual-view',
  templateUrl: './order-individual-view.component.html',
})
export class OrderIndividualViewComponent implements OnInit {
  private orderId: any;
  public order: Order = {};

  constructor(
    private toolbarService: ToolbarService,
    private route: ActivatedRoute,
    public ordersApiService: OrdersAPIService,
    public changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    //this.toolbarService.setVisibility(false); // Hide the toolbar
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['order_id'];
    });
    this.getOrder(this.orderId);
  }

  ngOnDestroy() {
    this.toolbarService.setVisibility(true); // Show the toolbar when the component is destroyed
  }

  getOrder(orderId: any) {
    this.ordersApiService.ordersOrderIdGet(orderId).subscribe((data) => {
      this.order = data;
      this.changeDetector.detectChanges();
      console.log(
        `Order received: ${data.id} - ${JSON.stringify(data.status)}`,
      );
    });
  }
}
