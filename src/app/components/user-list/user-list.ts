import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';
import { CapitalizePipe } from '../../pipes/capitalize-pipe';

/**
 * TRAINING MODULE 3: Component Testing
 * 
 * This component demonstrates:
 * - Component lifecycle testing
 * - Service dependency injection
 * - Input/Output property testing
 * - Event handling
 * - DOM manipulation testing
 * - Async operations testing
 * - Error handling
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  @Input() showInactive: boolean = false;
  @Input() maxUsers: number = 10;
  @Output() userSelected = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<number>();

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  selectedUserId: number | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load users from the service
   * Demonstrates: HTTP calls, loading states, error handling
   */
  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  /**
   * Handle search input changes
   * Demonstrates: Debounced search, user input handling
   */
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  /**
   * Perform the actual search
   * Demonstrates: Filtering logic, case-insensitive search
   */
  private performSearch(query: string): void {
    if (!query.trim()) {
      this.applyFilters();
      return;
    }

    this.userService.searchUsers(query).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: (error) => {
        this.error = 'Search failed. Please try again.';
        console.error('Search error:', error);
      }
    });
  }

  /**
   * Apply filters based on component inputs
   * Demonstrates: Business logic, filtering
   */
  private applyFilters(): void {
    let filtered = [...this.users];

    // Filter by active status
    if (!this.showInactive) {
      filtered = filtered.filter(user => user.isActive);
    }

    // Limit number of users
    if (this.maxUsers > 0) {
      filtered = filtered.slice(0, this.maxUsers);
    }

    this.filteredUsers = filtered;
  }

  /**
   * Handle user selection
   * Demonstrates: Event emission, state management
   */
  selectUser(user: User): void {
    this.selectedUserId = user.id;
    this.userSelected.emit(user);
  }

  /**
   * Handle user deletion
   * Demonstrates: Confirmation dialogs, optimistic updates
   */
  deleteUser(user: User, event: Event): void {
    event.stopPropagation(); // Prevent row selection

    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (success) => {
        if (success) {
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilters();
          this.userDeleted.emit(user.id);
        } else {
          this.error = 'Failed to delete user.';
        }
      },
      error: (error) => {
        this.error = 'Delete operation failed.';
        console.error('Delete error:', error);
      }
    });
  }

  /**
   * Refresh the user list
   * Demonstrates: Manual refresh, loading states
   */
  refresh(): void {
    this.searchQuery = '';
    this.selectedUserId = null;
    this.loadUsers();
  }

  /**
   * Get active users count
   * Demonstrates: Computed properties, service method usage
   */
  get activeUsersCount(): number {
    return this.userService.getActiveUsersCount(this.users);
  }

  /**
   * Check if user is selected
   * Demonstrates: Template helper methods
   */
  isUserSelected(user: User): boolean {
    return this.selectedUserId === user.id;
  }

  /**
   * Track by function for ngFor
   * Demonstrates: Performance optimization
   */
  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  /**
   * Clear error message
   * Demonstrates: Error state management
   */
  clearError(): void {
    this.error = null;
  }
}
