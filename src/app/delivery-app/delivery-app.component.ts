import { Component } from '@angular/core';

@Component({
  selector: 'app-delivery-app',
  templateUrl: './delivery-app.component.html',
  styleUrls: ['./delivery-app.component.css'],
})
export class DeliveryAppComponent {
  selectedFilter = 'Kitchen';
  selectedDate: Date | null = new Date();

  onFilterChanged(event: { filter: string, date: Date | null }) {
    console.log(`Filter changed: ${event.filter} - ${event.date}`);
    this.selectedFilter = event.filter;
    this.selectedDate = event.date;
  }
}
