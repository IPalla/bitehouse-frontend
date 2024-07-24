import { Component, OnInit } from '@angular/core';
import { ToolbarService } from './services/toolbar.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showToolbar: boolean = true;
  title = 'bitehouse-frontend';
  
  constructor(private toolbarService: ToolbarService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `bitehouse-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../../assets/B-BITE.svg`)
    );
  }

  ngOnInit() {
    this.toolbarService.getVisibility().subscribe(visible => {
      this.showToolbar = visible;
    });
  }
}
