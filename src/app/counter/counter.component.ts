import { Component } from '@angular/core';
import { Counter } from '@hub-fx/examples';

// See for implementation
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/Counter

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {
  counter = Counter();
}
