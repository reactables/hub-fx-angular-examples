import { Component, OnInit, Input } from '@angular/core';
import { HubFactory, Reducer } from '@hub-fx/core';
import { Observable } from 'rxjs';

// Pure reducer function to handle state updates
const countReducer: Reducer<{ count: number }> = (
  state = { count: 0 },
  action
) => {
  switch (action?.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
};

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
  // A component can have its own hub or connect to one from an ancestor component
  @Input() hub = HubFactory();
  state$: Observable<{ count: number }> | undefined;

  ngOnInit() {
    this.state$ = this.hub.store({ reducer: countReducer });
  }
}
