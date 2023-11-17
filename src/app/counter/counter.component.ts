import { Component } from '@angular/core';
import { RxCounter } from '@hub-fx/examples';

// For implementation and tests see:
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/Counter

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {
  counter = RxCounter();
}
