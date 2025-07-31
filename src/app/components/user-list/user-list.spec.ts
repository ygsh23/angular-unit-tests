import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { UserListComponent } from './user-list';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';
import { CapitalizePipe } from '../../pipes/capitalize-pipe';

/**
 * SIMPLIFIED TRAINING MODULE 3: Component Testing
 * 
 * This simplified test suite demonstrates basic component testing
 * without complex async operations that might cause issues.
 */
describe('UserListComponent (Simplified)', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  // Mock data
  const mockUsers: User[] = [
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

  beforeEach(async () => {
    // Create spy object for UserService
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'searchUsers',
      'deleteUser',
      'getActiveUsersCount'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, CommonModule, FormsModule, CapitalizePipe],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    // Setup default service responses
    userService.getUsers.and.returnValue(of(mockUsers));
    userService.searchUsers.and.returnValue(of(mockUsers));
    userService.deleteUser.and.returnValue(of(true));
    userService.getActiveUsersCount.and.returnValue(2);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.showInactive).toBe(false);
      expect(component.maxUsers).toBe(10);
      expect(component.users).toEqual([]);
      expect(component.filteredUsers).toEqual([]);
      expect(component.searchQuery).toBe('');
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
      expect(component.selectedUserId).toBeNull();
    });

    it('should load users on init', () => {
      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(userService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Input Properties', () => {
    it('should accept showInactive input', () => {
      // Arrange
      component.showInactive = true;
      component.users = mockUsers;

      // Act
      component['applyFilters']();

      // Assert
      expect(component.filteredUsers.length).toBe(2); // All users including inactive
    });

    it('should accept maxUsers input', () => {
      // Arrange
      component.maxUsers = 1;
      component.users = mockUsers;

      // Act
      component['applyFilters']();

      // Assert
      expect(component.filteredUsers.length).toBe(1);
    });
  });

  describe('Output Events', () => {
    it('should emit userSelected when user is selected', () => {
      // Arrange
      spyOn(component.userSelected, 'emit');
      const user = mockUsers[0];

      // Act
      component.selectUser(user);

      // Assert
      expect(component.userSelected.emit).toHaveBeenCalledWith(user);
      expect(component.selectedUserId).toBe(user.id);
    });
  });

  describe('Utility Methods', () => {
    it('should track users by ID', () => {
      // Arrange
      const user = mockUsers[0];

      // Act
      const result = component.trackByUserId(0, user);

      // Assert
      expect(result).toBe(user.id);
    });

    it('should check if user is selected', () => {
      // Arrange
      component.selectedUserId = 1;
      const user = mockUsers[0];

      // Act
      const result = component.isUserSelected(user);

      // Assert
      expect(result).toBe(true);
    });

    it('should get active users count from service', () => {
      // Arrange
      component.users = mockUsers;

      // Act
      const count = component.activeUsersCount;

      // Assert
      expect(userService.getActiveUsersCount).toHaveBeenCalledWith(mockUsers);
      expect(count).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should clear error when clearError is called', () => {
      // Arrange
      component.error = 'Some error';

      // Act
      component.clearError();

      // Assert
      expect(component.error).toBeNull();
    });
  });

  describe('Filtering Logic', () => {
    it('should filter out inactive users by default', () => {
      // Arrange
      component.users = mockUsers;
      component.showInactive = false;

      // Act
      component['applyFilters']();

      // Assert
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers.every(u => u.isActive)).toBe(true);
    });

    it('should include inactive users when showInactive is true', () => {
      // Arrange
      component.users = mockUsers;
      component.showInactive = true;

      // Act
      component['applyFilters']();

      // Assert
      expect(component.filteredUsers.length).toBe(2);
    });

    it('should limit users based on maxUsers', () => {
      // Arrange
      component.users = mockUsers;
      component.maxUsers = 1;
      component.showInactive = true;

      // Act
      component['applyFilters']();

      // Assert
      expect(component.filteredUsers.length).toBe(1);
    });
  });
});
