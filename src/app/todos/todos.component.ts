import { Component } from '@angular/core';
import { Reducer, Effect, Action } from '@hub-fx/core';
import { UpdateTodoPayload, Todo } from '../models/Todos';
import { TodoServiceService } from '../todo-service.service';
import { mergeMap, map } from 'rxjs/operators';

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
const reducer: Reducer<{ todos: Todo[] }> = (state = { todos: [] }, action) => {
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

          const status =
            (action as Action<UpdateTodoPayload>).payload?.status ||
            todo.status;

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
    todoService: TodoServiceService
  ): Effect<UpdateTodoPayload, UpdateTodoPayload> =>
  (actions$) => {
    return actions$.pipe(
      mergeMap(({ payload }) => todoService.updateTodo(payload)),
      map((payload) => todoStatusUpdateSuccess(payload))
    );
  };

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent {}
