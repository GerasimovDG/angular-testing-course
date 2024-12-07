import { HeaderComponent } from './header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosService } from '../../services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let todosService: TodosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo', () => {
    jest.spyOn(todosService, 'addTodo').mockImplementation(() => {});

    const inputElement = fixture.debugElement.query(
      By.css('[data-testid="newTodoInput"]')
    );

    inputElement.nativeElement.value = 'foo';
    inputElement.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: 'Enter',
      })
    );

    expect(todosService.addTodo).toHaveBeenCalledWith('foo');
    expect(component.text).toEqual('');
  });
})
