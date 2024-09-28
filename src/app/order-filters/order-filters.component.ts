import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.css']
})
export class OrderFiltersComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<{ filter: string, date: Date | null }>();
  selectedFilter = 'Kitchen';
  selectedDate: Date | null = new Date();

  ngOnInit(): void {
    this.emitFilterChange();
  }

  emitFilterChange() {
    this.filterChanged.emit({ filter: this.selectedFilter, date: this.selectedDate });
  }
}