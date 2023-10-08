import { Component, OnInit, Input } from '@angular/core';
import { Reducer, Effect, Action, HubFactory } from '@hub-fx/core';
import { UpdateTodoPayload, Todo, TodoStatus } from '../models/Todos';
import { TodoService } from '../todo.service';
import { mergeMap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Actions
const SEND_TODO_STATUS_UPDATE = 'SEND_TODO_STATUS_UPDATE';
const sendTodoStatusUpdate = (
  payload: UpdateTodoPayload // { todoId: number, status: 'done' | 'incomplete' | 'in progress' }
): Action<UpdateTodoPayload> => ({
  type: SEND_TODO_STATUS_UPDATE,
  payload,
});

const TODO_STATUS_UPDATE_SUCCESS = 'TODO_STATUS_UPDATE_SUCCESS';
const todoStatusUpdateSuccess = (
  payload: UpdateTodoPayload
): Action<UpdateTodoPayload> => ({
  type: TODO_STATUS_UPDATE_SUCCESS,
  payload,
});

// State
interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [
    {
      id: 1,
      description: 'Pick Up Bart',
      status: 'incomplete',
      updating: false,
    },
    {
      id: 2,
      description: 'Moe the lawn',
      status: 'incomplete',
      updating: false,
    },
  ],
};

// Reducer for updating state
const reducer: Reducer<TodosState> = (state = initialState, action) => {
  switch (action?.type) {
    case SEND_TODO_STATUS_UPDATE:
      return {
        // Find todo and setting updating flag to true

        todos: state.todos.reduce((acc, todo) => {
          const { todoId } = <UpdateTodoPayload>action.payload;

          const newTodo =
            todo.id === todoId ? { ...todo, updating: true } : todo;

          return acc.concat(newTodo);
        }, [] as Todo[]),
      };
    case TODO_STATUS_UPDATE_SUCCESS:
      return {
        // Find todo and mark new status and set updating flag to false

        todos: state.todos.reduce((acc, todo) => {
          const { todoId, status } = <UpdateTodoPayload>action.payload;

          const newTodo =
            todo.id === todoId ? { ...todo, status, updating: false } : todo;

          return acc.concat(newTodo);
        }, [] as Todo[]),
      };
  }
  return state;
};

// Effect to listen for update todo action and handling update todo API call
const updateTodoEffect =
  (
    // Provide the method from Todos API service for updating Todos
    updateTodo: (payload: UpdateTodoPayload) => Observable<UpdateTodoPayload>
  ): Effect<unknown, unknown> =>
  (actions$) => {
    return actions$.pipe(
      // Effect will only react for update todo action
      filter((action) => action.type === SEND_TODO_STATUS_UPDATE),

      // Call todo API Service
      mergeMap(({ payload }) => updateTodo(payload as UpdateTodoPayload)),

      // Map success response to appropriate action
      map((payload) => todoStatusUpdateSuccess(payload))
    );
  };

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  // Intialize hub with the update todo effect in the hub config
  @Input() hub = HubFactory({
    effects: [updateTodoEffect(this.todoService.updateTodo)],
  });
  // If you choose a hub from an ancestor component
  // declare the effect in the ancestor's hub config

  constructor(private todoService: TodoService) {}

  state$: Observable<TodosState> | undefined;

  statusChange(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.hub.dispatch(sendTodoStatusUpdate({ todoId, status }));
  }

  ngOnInit() {
    // Create state observable stream on component initialization
    this.state$ = this.hub.store({ reducer });
  }
}
