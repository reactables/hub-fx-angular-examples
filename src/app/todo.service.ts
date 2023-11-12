import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UpdateTodoPayload } from '@hub-fx/examples';

// See for implementation
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/TodoUpdates

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor() {}

  updateTodo(payload: UpdateTodoPayload): Observable<UpdateTodoPayload> {
    return of(payload).pipe(delay(2000));
  }
}
