import { Component } from '@angular/core';
import { TodosComponent } from './todos/todos.component';
import { PostsComponent } from './posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodosComponent, PostsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
