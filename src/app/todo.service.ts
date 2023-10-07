import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UpdateTodoPayload } from './models/Todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor() {}

  updateTodo(payload: UpdateTodoPayload): Observable<UpdateTodoPayload> {
    return of(payload).pipe(delay(1000));
  }
}
