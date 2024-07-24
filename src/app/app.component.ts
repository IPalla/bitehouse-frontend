import { Component, OnInit } from '@angular/core';
import { ToolbarService } from './services/toolbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showToolbar: boolean = true;
  title = 'bitehouse-frontend';
  
  constructor(private toolbarService: ToolbarService) {}

  ngOnInit() {
    this.toolbarService.getVisibility().subscribe(visible => {
      this.showToolbar = visible;
    });
  }
}
