import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { App } from './app';
import { UserService } from './services/user';
import { of } from 'rxjs';

describe('App', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'getActiveUsersCount']);
    
    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userService.getUsers.and.returnValue(of([]));
    userService.getActiveUsersCount.and.returnValue(0);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular Unit Testing Demo');
  });

  it('should handle user selection', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date()
    };

    app.onUserSelected(mockUser);
    expect(app.selectedUser).toEqual(mockUser);
  });

  it('should handle user deletion', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.selectedUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date()
    };

    app.onUserDeleted(1);
    expect(app.selectedUser).toBeNull();
  });
});
