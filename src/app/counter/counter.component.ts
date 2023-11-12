import { Component } from '@angular/core';
import { Counter } from '@hub-fx/examples';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {
  counter = Counter();
}
