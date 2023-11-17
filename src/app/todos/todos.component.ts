import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { RxTodoUpdates, TodoStatus } from '@hub-fx/examples';

// For implementation and tests see:
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/TodoUpdates

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent {
  todoUpdates = RxTodoUpdates(TodoService.updateTodo);

  sendTodoStatusUpdate(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.todoUpdates.actions.sendTodoStatusUpdate({ todoId, status });
  }
}
