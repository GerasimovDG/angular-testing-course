import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TodosService } from '../../services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoComponent } from './todo.component';
import { TodoInterface } from '../../types/todo.interface';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';
import { SimpleChange } from '@angular/core';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todosService: TodosService;

  const TODO: TodoInterface = { id: '1', text: 'foo', isCompleted: false };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    component.todo = TODO;
    component.isEditing = false;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('has a correct initial state', () => {
    const liElement = fixture.debugElement.query(By.css('[data-testid="todo"]'));
    expect(liElement.classes['editing']).not.toBeDefined();
    expect(liElement.classes['completed']).not.toBeDefined();

    const toggleElement = fixture.debugElement.query(By.css('[data-testid="toggle"]'));
    expect(toggleElement.nativeElement.checked).toEqual(TODO.isCompleted);

    const labelElement = fixture.debugElement.query(By.css('[data-testid="label"]'));
    expect(labelElement.nativeElement.textContent).toEqual(TODO.text);

    const editElement = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    expect(editElement).toBeFalsy();
  });

  it('should toggle a todo', () => {
    jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});

    const toggleElement = fixture.debugElement.query(By.css('[data-testid="toggle"]'));
    toggleElement.nativeElement.click();

    expect(todosService.toggleTodo).toHaveBeenCalledWith(TODO.id);
  });

  it('should destroy a todo', () => {
    jest.spyOn(todosService, 'removeTodo').mockImplementation(() => {});

    const destroyElement = fixture.debugElement.query(By.css('[data-testid="destroy"]'));
    destroyElement.nativeElement.click();

    expect(todosService.removeTodo).toHaveBeenCalledWith(TODO.id);
  });

  it('should activate editing mode', () => {
    const labelElement = fixture.debugElement.query(By.css('[data-testid="label"]'));

    let clickedTodoId: string | null | undefined;
    component.setEditingId.pipe(first()).subscribe(todoId => {
      clickedTodoId = todoId;
    });
    labelElement.triggerEventHandler('dblclick');
    expect(clickedTodoId).toEqual('1');

    component.isEditing = true;
    fixture.detectChanges();
    const editElement = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    expect(editElement.nativeElement).toBeDefined();
  });

  it('should change a todo', () => {
    jest.spyOn(todosService, 'changeTodo').mockImplementation(() => {});
    component.isEditing = true;
    fixture.detectChanges();

    const editElement = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    editElement.nativeElement.value = 'foo';

    let editingId: string | null | undefined;
    component.setEditingId.pipe(first()).subscribe((id) => {
      editingId = id;
    });
    editElement.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );

    expect(todosService.changeTodo).toHaveBeenCalledWith(TODO.id, 'foo');
    expect(editingId).toEqual(null);
  });

  it('should focus after editing activation', fakeAsync(() => {
    component.isEditing = true;
    component.ngOnChanges({
      isEditing: new SimpleChange(false, true, false),
    });

    fixture.detectChanges();
    tick(0);
    const editElement = fixture.debugElement.query(By.css('[data-testid="edit"]:focus'));
    expect(editElement).toBeTruthy();
  }));
});
