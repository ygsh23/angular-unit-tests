import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { User, CreateUserRequest, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Get all users from the API
   * Demonstrates: HTTP GET, error handling, data transformation
   */
  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(user => this.transformUser(user))),
      catchError(this.handleError)
    );
  }

  /**
   * Get user by ID
   * Demonstrates: HTTP GET with parameters, null handling
   */
  getUserById(id: number): Observable<User | null> {
    if (!id || id <= 0) {
      return of(null);
    }

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(user => this.transformUser(user)),
      catchError(() => of(null))
    );
  }

  /**
   * Create a new user
   * Demonstrates: HTTP POST, request transformation
   */
  createUser(userRequest: CreateUserRequest): Observable<ApiResponse<User>> {
    const payload = {
      ...userRequest,
      id: Math.floor(Math.random() * 1000) + 100
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(response => ({
        data: this.transformUser(response),
        message: 'User created successfully',
        success: true
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Update user
   * Demonstrates: HTTP PUT, optimistic updates
   */
  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updates).pipe(
      map(user => this.transformUser(user)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete user
   * Demonstrates: HTTP DELETE, boolean response
   */
  deleteUser(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Search users by name
   * Demonstrates: Filtering, case-insensitive search
   */
  searchUsers(query: string): Observable<User[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    return this.getUsers().pipe(
      map(users => users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Get active users count
   * Demonstrates: Synchronous method, business logic
   */
  getActiveUsersCount(users: User[]): number {
    return users.filter(user => user.isActive).length;
  }

  /**
   * Validate user email
   * Demonstrates: Pure function, validation logic
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simulate async operation with delay
   * Demonstrates: Async testing, delays
   */
  getUsersWithDelay(): Observable<User[]> {
    return this.getUsers().pipe(
      delay(1000)
    );
  }

  /**
   * Update users cache
   * Demonstrates: State management, BehaviorSubject
   */
  updateUsersCache(users: User[]): void {
    this.usersSubject.next(users);
  }

  /**
   * Transform API response to User model
   * Private method for testing internal logic
   */
  private transformUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name || '',
      email: apiUser.email || '',
      age: apiUser.age || 0,
      isActive: apiUser.isActive ?? true,
      createdAt: new Date(apiUser.createdAt || Date.now())
    };
  }

  /**
   * Handle HTTP errors
   * Private method for error handling
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
