import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorMessageComponent} from './error-message.component';
import {By} from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders default error state', () => {
    const messageContainer = fixture.debugElement.query(
      By.css('[data-testid="message-container"]')
    );

    expect(messageContainer.nativeElement.textContent).toEqual('Something went wrong');
  });

  it('renders custom error message', () => {
    component.message = 'Email is already taken';
    fixture.detectChanges();
    const messageContainer = fixture.debugElement.query(
      By.css('[data-testid="message-container"]')
    );

    expect(messageContainer.nativeElement.textContent).toEqual('Email is already taken');
  })
});
