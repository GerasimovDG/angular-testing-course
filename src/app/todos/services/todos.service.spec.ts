import { TestBed } from '@angular/core/testing';
import { TodosService } from './todos.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FilterEnum } from '../types/filter.enum';
import { provideHttpClient } from '@angular/common/http';
import { TodoInterface } from '../types/todo.interface';

describe('TodosService', () => {
  let todosService: TodosService;
  let httpTestingController: HttpTestingController;

  const baseUrl = 'http://localhost:3004/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService, provideHttpClient(), provideHttpClientTesting()],
    });
    todosService = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(todosService).toBeTruthy();
  });

  it('sets initial data', () => {
    expect(todosService.apiBaseUrl).toEqual(baseUrl);
    expect(todosService.todosSig()).toEqual([]);
    expect(todosService.filterSig()).toEqual(FilterEnum.all);
  });

  describe('changeFilter', () => {
    it('changes the filter', () => {
      todosService.changeFilter(FilterEnum.active);
      expect(todosService.filterSig()).toEqual(FilterEnum.active);
    });
  });

  describe('getTodos', () => {
    it('gets correct data', () => {
      todosService.getTodos();
      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');

      req.flush([{ id: '1', text: 'Complete the course', isCompleted: false }] as TodoInterface[]);
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'Complete the course', isCompleted: false }
      ]);
    });
  });

  describe('addTodos', () => {
    it('creates a todo', () => {
      todosService.addTodo('Get some sleep');
      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');

      req.flush({ id: '1', text: 'Get some sleep', isCompleted: false } as TodoInterface);
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'Get some sleep', isCompleted: false }
      ]);
    });
  });

  describe('changeTodo', () => {
    it('updates a todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'Get some sleep', isCompleted: false }]);

      todosService.changeTodo('1', 'Get more then 8 hours sleep');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PATCH');

      req.flush({ id: '1', text: 'Get more then 8 hours sleep', isCompleted: false } as TodoInterface);
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'Get more then 8 hours sleep', isCompleted: false }
      ]);
    });
  });

  describe('removeTodo', () => {
    it('removes a todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'Get some sleep', isCompleted: false }]);
      todosService.removeTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');

      req.flush({});
      expect(todosService.todosSig()).toEqual([]);
    });
  });

  describe('toggleTodo', () => {
    it('toggles a todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'Get some sleep', isCompleted: false }]);
      todosService.toggleTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ id: '1', text: 'Get some sleep', isCompleted: true });

      expect(todosService.todosSig()).toEqual([{ id: '1', text: 'Get some sleep', isCompleted: true }]);
    });

    it('throws an error when try to toggle todo with wrong id', () => {
      todosService.todosSig.set([{ id: '1', text: 'Get some sleep', isCompleted: false }]);
      expect(() => todosService.toggleTodo('2')).toThrowError("Didn't find todo to update");
    });
  });

  describe('toggleAll', () => {
    it('toggles all todos', () => {
      todosService.todosSig.set([
        { text: 'foo', isCompleted: false, id: '1' },
        { text: 'bar', isCompleted: false, id: '2' },
      ]);
      todosService.toggleAll(true);
      const reqs = httpTestingController.match((request) =>
        request.url.includes(baseUrl)
      );
      reqs[0].flush({ text: 'foo', isCompleted: true, id: '1' });
      reqs[1].flush({ text: 'bar', isCompleted: true, id: '2' });
      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
        { text: 'bar', isCompleted: true, id: '2' },
      ]);
    });
  });
});
