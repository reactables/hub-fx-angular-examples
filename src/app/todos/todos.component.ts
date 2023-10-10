import { Component, OnInit, Input } from '@angular/core';
import { Reducer, Action, HubFactory } from '@hub-fx/core';
import { UpdateTodoPayload, Todo, TodoStatus } from '../models/Todos';
import { TodoService } from '../todo.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Actions
const SEND_TODO_STATUS_UPDATE = 'SEND_TODO_STATUS_UPDATE';
const sendTodoStatusUpdate = (
  payload: UpdateTodoPayload, // { todoId: number, status: 'done' | 'incomplete' | 'in progress' }
  // Provide the method from Todos API service for updating Todos
  updateTodo: (payload: UpdateTodoPayload) => Observable<UpdateTodoPayload>
): Action<UpdateTodoPayload, UpdateTodoPayload> => ({
  type: SEND_TODO_STATUS_UPDATE,
  payload,
  scopedEffects: {
    // Provide key so effect stream is dynamically created for SEND_TODO_STATUS_UPDATE on todo.id
    key: payload.todoId,

    // Scoped Effects to listen for update todo action and handling update todo API call
    effects: [
      (actions$: Observable<Action<UpdateTodoPayload>>) => {
        return actions$.pipe(
          // Call todo API Service - switchMap operator cancels previous pending call if a new one is initiated
          switchMap(({ payload }) => updateTodo(payload as UpdateTodoPayload)),

          // Map success response to appropriate action
          map((payload) => todoStatusUpdateSuccess(payload))
        );
      },
    ],
  },
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
      // Find todo and setting updating flag to true

      return {
        todos: state.todos.reduce((acc, todo) => {
          const { todoId } = <UpdateTodoPayload>action.payload;

          const newTodo =
            todo.id === todoId ? { ...todo, updating: true } : todo;

          return acc.concat(newTodo);
        }, [] as Todo[]),
      };
    case TODO_STATUS_UPDATE_SUCCESS:
      // Find todo and mark new status and set updating flag to false

      return {
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

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  // Intialize a hub
  hub = HubFactory();

  constructor(public todoService: TodoService) {}
  state$: Observable<TodosState> | undefined;

  statusChange(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.hub.dispatch(
      sendTodoStatusUpdate({ todoId, status }, this.todoService.updateTodo)
    );
  }

  ngOnInit() {
    // Create state observable stream on component initialization
    this.state$ = this.hub.store({ reducer });
  }
}
