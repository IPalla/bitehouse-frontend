import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private toolbarVisibility = new BehaviorSubject<boolean>(true);

  setVisibility(visible: boolean) {
    this.toolbarVisibility.next(visible);
  }

  getVisibility() {
    return this.toolbarVisibility.asObservable();
  }
}