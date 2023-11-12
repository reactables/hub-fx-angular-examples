import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { TodoUpdates, TodoStatus } from '@hub-fx/examples';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent {
  constructor(public todoService: TodoService) {}

  todoUpdates = TodoUpdates(this.todoService.updateTodo);

  sendTodoStatusUpdate(todoId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;

    this.todoUpdates.actions.sendTodoStatusUpdate({ todoId, status });
  }
}
