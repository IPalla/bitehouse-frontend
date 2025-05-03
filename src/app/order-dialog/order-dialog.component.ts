import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, Status } from '../services/delivery-manager';
import * as moment from 'moment';

@Component({
  selector: 'order-dialog',
  styleUrls: ['./order-dialog.component.css'],
  templateUrl: './order-dialog.component.html',
  standalone: true,
  imports: [MatCardModule, CommonModule],
})
export class OrderDialogComponent implements OnInit {
  order: Order;
  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order },
  ) {
    this.order = data.order;
  }

  ngOnInit(): void {
    console.log(`OrderDialogComponent.onOpen: ${JSON.stringify(this.order)}`);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  callToCustomer(): void {
    location.href = `tel:${this.order?.customer?.phone_number}`;
  }

  callToRider(): void {
    location.href = `tel:${this.order?.rider?.phone}`;
  }

  dateToString(timestamp?: number): string {
    return timestamp ? moment.unix(timestamp / 1000).format('HH:mm') : '';
  }

  millisToMinutes(millis?: number): number {
    return millis ? Math.floor(millis / 60000) : 0;
  }

  diffDates(date1: string, date2: string): number {
    return (
      moment(date1, 'DD/MM HH:mm').diff(moment(date2, 'DD/MM HH:mm')) /
      (1000 * 60)
    );
  }

  getDeliveredTime(): string {
    const createdTs: number = Number(this.order?.operation?.createdTs || 0);
    const kitchenTime: number = Number(this.order?.operation?.kitchenTime || 0);
    const inDeliveryTime: number = Number(
      this.order?.operation?.inDeliveryTime || 0,
    );
    return this.dateToString(createdTs + kitchenTime + inDeliveryTime);
  }

  isDelivery(): boolean {
    return this.order?.type === Order.TypeEnum.Delivery;
  }

  isFinished(): boolean {
    return (
      this.order?.status?.status === Status.StatusEnum.DELIVERED ||
      ((this.order?.status?.status === Status.StatusEnum.PREPARED ||
        this.order?.status?.status === Status.StatusEnum.PREPARED) &&
        this.order?.type !== Order.TypeEnum.Delivery)
    );
  }

  getReadyTime(): string {
    const createdTs: number = Number(this.order?.operation?.createdTs || 0);
    const kitchenTime: number = Number(this.order?.operation?.kitchenTime || 0);
    return this.dateToString(createdTs + kitchenTime);
  }
}
