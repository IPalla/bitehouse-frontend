import { Component } from '@angular/core';

@Component({
  selector: 'app-pickup-screen',
  templateUrl: './pickup-screen.component.html',
  styleUrls: ['./pickup-screen.component.css']
})
export class PickupScreenComponent {
  reproducir() {
    const audio = new Audio('http://localhost:8080/orders/1234/audio');
    audio.play();
  }
}