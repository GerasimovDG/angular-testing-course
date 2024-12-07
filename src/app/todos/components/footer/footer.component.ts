import { Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';

@Component({
  selector: 'app-todos-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
})
export class FooterComponent {
  private todosService = inject(TodosService);

  protected readonly filterEnum = FilterEnum;

  filterSig = this.todosService.filterSig;
  activeCount = computed(() => {
    return this.todosService.todosSig().filter((todo) => !todo.isCompleted)
      .length;
  });
  noTodosClass = computed(() => this.todosService.todosSig().length === 0);
  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  );

  changeFilter(filterName: FilterEnum): void {
    this.todosService.changeFilter(filterName);
  }
}
