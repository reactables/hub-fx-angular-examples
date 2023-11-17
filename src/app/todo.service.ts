import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UpdateTodoPayload } from '@hub-fx/examples';

// See for implementation
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/TodoUpdates

export class TodoService {
  constructor() {}

  static updateTodo(payload: UpdateTodoPayload): Observable<UpdateTodoPayload> {
    return of(payload).pipe(delay(2000));
  }
}
