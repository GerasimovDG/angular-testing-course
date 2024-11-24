import { Component } from '@angular/core';
import { TodosComponent } from './todos/todos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodosComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
