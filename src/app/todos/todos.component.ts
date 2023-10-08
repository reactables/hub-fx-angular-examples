import { Component, OnInit, Input } from '@angular/core';
import { Reducer, Action, HubFactory } from '@hub-fx/core';
import { UpdateTodoPayload, Todo, TodoStatus } from '../models/Todos';
import { TodoService } from '../todo.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Actions
const SEND_TODO_STATUS_UPDATE = 'SEND_TODO_STATUS_UPDATE';
const sendTodoStatusUpdate = (
  payload: UpdateTodoPayload,
  updateTodo: (payload: UpdateTodoPayload) => Observable<UpdateTodoPayload>
) => ({
  type: SEND_TODO_STATUS_UPDATE,
  payload,
  scopedEffects: {
    key: payload.todoId.toString(),
    effects: [
      (actions$: Observable<Action<UpdateTodoPayload>>) => {
        return actions$.pipe(
          switchMap(({ payload }) => updateTodo(payload as UpdateTodoPayload)),
          map((payload) => todoStatusUpdateSuccess(payload))
        );
      },
    ],
  },
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
          const todoId = (<UpdateTodoPayload>action.payload).todoId;

          const newTodo =
            todo.id === todoId
              ? {
                  ...todo,
                  updating: true,
                }
              : todo;

          return acc.concat(newTodo);
        }, [] as Todo[]),
      };
    case TODO_STATUS_UPDATE_SUCCESS:
      return {
        todos: state.todos.reduce((acc, todo) => {
          const todoId = (<UpdateTodoPayload>action.payload).todoId;
          const status = (<UpdateTodoPayload>action.payload).status;

          const newTodo =
            todo.id === todoId
              ? {
                  ...todo,
                  status,
                  updating: false,
                }
              : todo;

          return acc.concat(newTodo);
        }, [] as Todo[]),
      };
  }
  return state;
};

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  @Input() hub = HubFactory();

  constructor(public todoService: TodoService) {}
  state$: Observable<TodosState> | undefined;

  statusChange(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.hub.dispatch(
      sendTodoStatusUpdate({ todoId, status }, this.todoService.updateTodo)
    );
  }

  ngOnInit() {
    this.state$ = this.hub.store({ reducer });
  }
}
