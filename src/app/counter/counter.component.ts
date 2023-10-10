import { Component, OnInit } from '@angular/core';
import { HubFactory, Reducer, Action } from '@hub-fx/core';
import { Observable } from 'rxjs';

// Actions
const INCREMENT = 'INCREMENT';
const increment = (): Action => ({ type: INCREMENT });

const RESET = 'RESET';
const reset = (): Action => ({ type: RESET });

// Reducer function to handle state updates
const countReducer: Reducer<{ count: number }> = (
  state = { count: 0 },
  action
) => {
  switch (action?.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case RESET:
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
  // Initialize a hub
  hub = HubFactory();

  state$: Observable<{ count: number }> | undefined;

  increment() {
    this.hub.dispatch(increment());
  }

  reset() {
    this.hub.dispatch(reset());
  }

  ngOnInit() {
    // Create observable stream
    this.state$ = this.hub.store({ reducer: countReducer });
  }
}
