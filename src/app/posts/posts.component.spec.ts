import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PostsStateInterface } from './types/postsState.interface';
import { By } from '@angular/platform-browser';
import { AppStateInterface } from '../types/app-state.interface';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let store: MockStore<AppStateInterface>;
  const initialState = {
    posts: {
      isLoading: false,
      error: null,
      posts: [{id: '1', title: 'foo'}],
    } satisfies PostsStateInterface,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [provideMockStore({initialState})]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore<AppStateInterface>);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('should render posts', () => {
    const postsElement = fixture.debugElement.queryAll(By.css('[data-testid="posts"]'));
    expect(postsElement.length).toEqual(1);
    expect(postsElement[0].nativeElement.textContent).toContain('foo');
  });

  it('should render loading', () => {
    store.setState({
      ...initialState,
      posts: {...initialState.posts, isLoading: true},
    });
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('[data-testid="loading"]'));
    expect(loadingElement).toBeTruthy();
  });

  it('should render error', () => {
    store.setState({
      ...initialState,
      posts: {...initialState.posts, error: 'Server Error'},
    });
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('[data-testid="error"]'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Server Error');
  });
});
