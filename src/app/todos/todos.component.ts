import { Component, OnInit, Input } from '@angular/core';
import { Reducer, Effect, Action, HubFactory } from '@hub-fx/core';
import { UpdateTodoPayload, Todo, TodoStatus } from '../models/Todos';
import { TodoService } from '../todo.service';
import { mergeMap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Actions
const SEND_TODO_STATUS_UPDATE = 'SEND_TODO_STATUS_UPDATE';
const sendTodoStatusUpdate = (payload: UpdateTodoPayload) => ({
  type: SEND_TODO_STATUS_UPDATE,
  payload,
});

const TODO_STATUS_UPDATE_SUCCESS = 'TODO_STATUS_UPDATE_SUCCESS';
const todoStatusUpdateSuccess = (payload: UpdateTodoPayload) => ({
  type: TODO_STATUS_UPDATE_SUCCESS,
  payload,
});

// Reducer
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

const reducer: Reducer<TodosState> = (state = initialState, action) => {
  switch (action?.type) {
    case SEND_TODO_STATUS_UPDATE:
      return {
        todos: state.todos.reduce((acc, todo) => {
          const todoId = (action as Action<UpdateTodoPayload>).payload?.todoId;

          if (todo.id === todoId) {
            return acc.concat({
              ...todo,
              updating: true,
            });
          }
          return acc.concat(todo);
        }, [] as Todo[]),
      };
    case TODO_STATUS_UPDATE_SUCCESS:
      return {
        todos: state.todos.reduce((acc, todo) => {
          const todoId = (action as Action<UpdateTodoPayload>).payload?.todoId;

          const status = (action as Action<UpdateTodoPayload>).payload
            ?.status as TodoStatus;

          if (todo.id === todoId) {
            return acc.concat({
              ...todo,
              status,
              updating: false,
            });
          }
          return acc.concat(todo);
        }, [] as Todo[]),
      };
  }
  return state;
};

const updateTodoEffect =
  (
    updateTodo: (payload: UpdateTodoPayload) => Observable<UpdateTodoPayload>
  ): Effect<unknown, unknown> =>
  (actions$) => {
    return actions$.pipe(
      filter((action) => action.type === SEND_TODO_STATUS_UPDATE),
      mergeMap(({ payload }) => updateTodo(payload as UpdateTodoPayload)),
      map((payload) => todoStatusUpdateSuccess(payload))
    );
  };

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  @Input() hub = HubFactory({
    effects: [updateTodoEffect(this.todoService.updateTodo)],
  });

  constructor(public todoService: TodoService) {}
  state$: Observable<TodosState> | undefined;

  statusChange(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.hub.dispatch(sendTodoStatusUpdate({ todoId, status }));
  }

  ngOnInit() {
    this.state$ = this.hub.store({ reducer });
  }
}
