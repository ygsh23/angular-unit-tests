import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';
import { User, CreateUserRequest, ApiResponse } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * TRAINING MODULE 2: Service Testing
 * 
 * This test suite demonstrates:
 * 1. Service testing setup with HttpClientTestingModule
 * 2. Mocking HTTP requests and responses
 * 3. Testing error scenarios
 * 4. Testing synchronous and asynchronous methods
 * 5. Testing private method behavior through public methods
 * 6. Testing observables and subscriptions
 */
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // Mock data for testing
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date('2023-01-01')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      isActive: false,
      createdAt: new Date('2023-01-02')
    }
  ];

  const mockApiUsers = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      age: 30,
      isActive: true,
      createdAt: '2023-01-01'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      age: 25,
      isActive: false,
      createdAt: '2023-01-02'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty users observable', (done) => {
      service.users$.subscribe(users => {
        expect(users).toEqual([]);
        done();
      });
    });
  });

  describe('getUsers()', () => {
    it('should fetch users from API and transform them', () => {
      // Arrange
      const expectedUsers: User[] = mockUsers;

      // Act
      service.getUsers().subscribe(users => {
        // Assert
        expect(users).toEqual(expectedUsers);
        expect(users[0].isActive).toBeDefined();
        expect(users[0].createdAt).toBeDefined();
      });

      // Expect HTTP request
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      
      // Respond with mock data
      req.flush(mockApiUsers);
    });

    it('should handle HTTP error gracefully', () => {
      // Act
      service.getUsers().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      // Simulate server error
      const req = httpMock.expectOne(apiUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserById()', () => {
    it('should fetch user by valid ID', () => {
      // Arrange
      const userId = 1;
      const expectedUser = mockUsers[0];

      // Act
      service.getUserById(userId).subscribe(user => {
        // Assert
        expect(user).toEqual(expectedUser);
      });

      // Expect HTTP request
      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiUsers[0]);
    });

    it('should return null for invalid ID', () => {
      // Test cases for invalid IDs
      const invalidIds = [0, -1, null, undefined];
      
      invalidIds.forEach(id => {
        service.getUserById(id as any).subscribe(user => {
          expect(user).toBeNull();
        });
      });

      // No HTTP requests should be made
      httpMock.expectNone(`${apiUrl}/${0}`);
    });

    it('should return null when user not found', () => {
      // Arrange
      const userId = 999;

      // Act
      service.getUserById(userId).subscribe(user => {
        // Assert
        expect(user).toBeNull();
      });

      // Simulate 404 error
      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser()', () => {
    it('should create user successfully', () => {
      // Arrange
      const userRequest: CreateUserRequest = {
        name: 'New User',
        email: 'newuser@example.com',
        age: 28
      };

      const mockResponse = {
        id: 101,
        name: 'New User',
        email: 'newuser@example.com'
      };

      // Act
      service.createUser(userRequest).subscribe((response: ApiResponse<User>) => {
        // Assert
        expect(response.success).toBe(true);
        expect(response.message).toBe('User created successfully');
        expect(response.data.name).toBe(userRequest.name);
        expect(response.data.email).toBe(userRequest.email);
      });

      // Expect HTTP POST request
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(jasmine.objectContaining(userRequest));
      req.flush(mockResponse);
    });
  });

  describe('updateUser()', () => {
    it('should update user successfully', () => {
      // Arrange
      const userId = 1;
      const updates = { name: 'Updated Name', age: 35 };
      const mockResponse = { ...mockApiUsers[0], ...updates };

      // Act
      service.updateUser(userId, updates).subscribe(user => {
        // Assert
        expect(user.name).toBe('Updated Name');
        expect(user.age).toBe(35);
      });

      // Expect HTTP PUT request
      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser()', () => {
    it('should delete user successfully', () => {
      // Arrange
      const userId = 1;

      // Act
      service.deleteUser(userId).subscribe(result => {
        // Assert
        expect(result).toBe(true);
      });

      // Expect HTTP DELETE request
      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should return false when delete fails', () => {
      // Arrange
      const userId = 1;

      // Act
      service.deleteUser(userId).subscribe(result => {
        // Assert
        expect(result).toBe(false);
      });

      // Simulate error
      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('searchUsers()', () => {
    beforeEach(() => {
      // Setup mock for getUsers call
      spyOn(service, 'getUsers').and.returnValue(service['http'].get<any[]>(apiUrl));
    });

    it('should search users by name (case insensitive)', () => {
      // Act
      service.searchUsers('john').subscribe(users => {
        // Assert
        expect(users.length).toBe(1);
        expect(users[0].name.toLowerCase()).toContain('john');
      });

      // Mock the HTTP call
      const req = httpMock.expectOne(apiUrl);
      req.flush(mockApiUsers);
    });

    it('should return empty array for empty query', () => {
      // Test empty and whitespace queries
      const emptyQueries = ['', '   ', null, undefined];
      
      emptyQueries.forEach(query => {
        service.searchUsers(query as any).subscribe(users => {
          expect(users).toEqual([]);
        });
      });
    });
  });

  describe('Synchronous Methods', () => {
    describe('getActiveUsersCount()', () => {
      it('should count active users correctly', () => {
        // Arrange
        const users = mockUsers;

        // Act
        const count = service.getActiveUsersCount(users);

        // Assert
        expect(count).toBe(1); // Only John Doe is active
      });

      it('should return 0 for empty array', () => {
        // Act
        const count = service.getActiveUsersCount([]);

        // Assert
        expect(count).toBe(0);
      });
    });

    describe('isValidEmail()', () => {
      it('should validate correct email formats', () => {
        // Arrange
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org'
        ];

        // Act & Assert
        validEmails.forEach(email => {
          expect(service.isValidEmail(email)).toBe(true);
        });
      });

      it('should reject invalid email formats', () => {
        // Arrange
        const invalidEmails = [
          'invalid-email',
          '@example.com',
          'user@',
          'user@.com',
          '',
          null,
          undefined
        ];

        // Act & Assert
        invalidEmails.forEach(email => {
          expect(service.isValidEmail(email as any)).toBe(false);
        });
      });
    });
  });

  describe('Async Operations', () => {
    it('should handle getUsersWithDelay()', (done) => {
      // Arrange
      const startTime = Date.now();

      // Act
      service.getUsersWithDelay().subscribe(users => {
        // Assert
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(1000); // At least 1 second delay
        expect(users).toBeDefined();
        done();
      });

      // Mock the HTTP call
      const req = httpMock.expectOne(apiUrl);
      req.flush(mockApiUsers);
    });
  });

  describe('State Management', () => {
    it('should update users cache', (done) => {
      // Arrange
      const testUsers = mockUsers;

      // Act
      service.updateUsersCache(testUsers);

      // Assert
      service.users$.subscribe(users => {
        expect(users).toEqual(testUsers);
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      // Act
      service.getUsers().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toContain('Error:');
        }
      });

      // Simulate network error
      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error', {
        message: 'Network connection failed'
      }));
    });
  });
});
