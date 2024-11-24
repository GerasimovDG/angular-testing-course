import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosService } from '../../services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MainComponent } from './main.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoInterface } from '../../types/todo.interface';
import { TodoComponent } from '../todo/todo.component';

// Shallow Testing
@Component({
  standalone: true,
  selector: 'app-todos-todo',
  template: ``,

})
class TodoComponentMock {
  @Input({required: true}) todo!: TodoInterface;
  @Input({required: true}) isEditing!: boolean;
  @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();
}


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let todosService: TodosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(MainComponent, {
        remove: {imports: [TodoComponent],},
        add: {imports: [TodoComponentMock],},
      }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  describe('component visibility', () => {
    it('should be hidden without todos', () => {
      const mainSection = fixture.debugElement.query(By.css('[data-testid="main"]'));
      expect(mainSection.classes['hidden']).toEqual(true);
    });

    it('should be visible with todos', () => {
      todosService.todosSig.set([{
        id: '1',
        text: 'Buy food',
        isCompleted: false,
      }]);
      fixture.detectChanges();
      const mainSection = fixture.debugElement.query(By.css('[data-testid="main"]'));
      expect(mainSection.classes['hidden']).not.toBeDefined();
    });

    it('should highlight toggle all checkbox', () => {
      todosService.todosSig.set([{
        id: '1',
        text: 'Buy food',
        isCompleted: true,
      }]);
      fixture.detectChanges();
      const toggleAll = fixture.debugElement.query(By.css('[data-testid="toggleAll"]'));

      expect(toggleAll.nativeElement.checked).toEqual(true);
    });

    it('should toggle all todos', () => {
      jest.spyOn(todosService, 'toggleAll').mockImplementation(() => {});

      todosService.todosSig.set([{
        id: '1',
        text: 'Buy food',
        isCompleted: true,
      }]);
      fixture.detectChanges();
      const toggleAll = fixture.debugElement.query(By.css('[data-testid="toggleAll"]'));

      toggleAll.nativeElement.click();

      expect(todosService.toggleAll).toHaveBeenCalledWith(false);
    });

    it('should render a list of todos', () => {
      todosService.todosSig.set([{ id: '1', text: 'Buy food',  isCompleted: false }]);
      fixture.detectChanges();

      const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));
      expect(todos.length).toEqual(1);
      expect(todos[0].componentInstance.todo).toEqual({ id: '1', text: 'Buy food',  isCompleted: false });
      expect(todos[0].componentInstance.isEditing).toEqual(false);
    });

    it('should change editing id', () => {
      todosService.todosSig.set([{ id: '1', text: 'Buy food',  isCompleted: false }]);
      fixture.detectChanges();

      const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));

      (todos[0].componentInstance as TodoComponentMock).setEditingId.emit('1');
      fixture.detectChanges();

      expect(component.editingId).toEqual('1');
      expect(todos[0].componentInstance.isEditing).toEqual(true);
    });
  });
})
