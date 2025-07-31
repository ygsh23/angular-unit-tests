import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { User, CreateUserRequest } from '../../models/user.model';
import { UserService } from '../../services/user';

/**
 * TRAINING MODULE 4: Form Testing
 * 
 * This component demonstrates:
 * - Reactive forms with validation
 * - Custom validators
 * - Form submission handling
 * - Error display
 * - Form reset functionality
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() editUser: User | null = null;
  @Input() isLoading: boolean = false;
  @Output() userSubmitted = new EventEmitter<CreateUserRequest>();
  @Output() formCancelled = new EventEmitter<void>();

  userForm: FormGroup;
  isSubmitting: boolean = false;
  submitError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.editUser) {
      this.populateForm(this.editUser);
    }

    // Watch for form changes to clear errors
    this.userForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.submitError) {
        this.submitError = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create the reactive form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.customEmailValidator
      ]],
      age: ['', [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
        this.integerValidator
      ]],
      isActive: [true]
    });
  }

  /**
   * Populate form with existing user data
   */
  private populateForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      age: user.age,
      isActive: user.isActive
    });
  }

  /**
   * Custom validator to prevent whitespace-only names
   */
  private noWhitespaceValidator(control: any) {
    if (!control.value) return null;
    const isWhitespace = control.value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  /**
   * Custom email validator with additional checks
   */
  private customEmailValidator(control: any) {
    if (!control.value) return null;
    
    const email = control.value;
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const domain = email.split('@')[1];
    
    if (domain && !validDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    
    return null;
  }

  /**
   * Validator to ensure age is an integer
   */
  private integerValidator(control: any) {
    if (!control.value) return null;
    const value = Number(control.value);
    return Number.isInteger(value) ? null : { notInteger: true };
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const formValue = this.userForm.value;
    const userRequest: CreateUserRequest = {
      name: formValue.name.trim(),
      email: formValue.email.toLowerCase().trim(),
      age: Number(formValue.age)
    };

    // Emit the user data
    this.userSubmitted.emit(userRequest);

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      if (!this.submitError) {
        this.resetForm();
      }
    }, 1000);
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.resetForm();
    this.formCancelled.emit();
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.userForm.reset({
      name: '',
      email: '',
      age: '',
      isActive: true
    });
    this.submitError = null;
    this.isSubmitting = false;
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return null;
    }

    const errors = field.errors;
    
    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['min']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${errors['max'].max}`;
    }
    if (errors['whitespace']) {
      return `${this.getFieldDisplayName(fieldName)} cannot be empty or contain only spaces`;
    }
    if (errors['invalidDomain']) {
      return 'Email domain is not allowed';
    }
    if (errors['notInteger']) {
      return 'Age must be a whole number';
    }

    return 'Invalid input';
  }

  /**
   * Get display name for field
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      age: 'Age',
      isActive: 'Status'
    };
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Check if field has error and is touched
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.errors && field.touched);
  }

  /**
   * Check if form is valid and not submitting
   */
  get canSubmit(): boolean {
    return this.userForm.valid && !this.isSubmitting && !this.isLoading;
  }

  /**
   * Get form title based on mode
   */
  get formTitle(): string {
    return this.editUser ? 'Edit User' : 'Create New User';
  }

  /**
   * Get submit button text based on state
   */
  get submitButtonText(): string {
    if (this.isSubmitting) {
      return 'Submitting...';
    }
    return this.editUser ? 'Update User' : 'Create User';
  }
}
