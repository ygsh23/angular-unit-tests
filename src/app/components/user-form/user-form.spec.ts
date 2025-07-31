import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';


// https://www.youtube.com/watch?v=66o_Th-FT7w

import { UserFormComponent } from './user-form';
import { UserService } from '../../services/user';
import { User, CreateUserRequest } from '../../models/user.model';

/**
 * TRAINING MODULE 4: Form Testing
 * 
 * This test suite demonstrates:
 * - Reactive form testing with FormBuilder
 * - Custom validator testing
 * - Form validation error testing
 * - Input/Output property testing
 * - Event emission testing
 * - DOM interaction testing
 * - Async form submission testing
 */
describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let compiled: HTMLElement;

  // Test data
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    createdAt: new Date('2023-01-01')
  };

  const validFormData = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    isActive: true
  };

  beforeEach(async () => {
    // Create spy object for UserService
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'createUser',
      'updateUser'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    compiled = fixture.nativeElement;
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.userForm).toBeDefined();
      expect(component.userForm.get('name')?.value).toBe('');
      expect(component.userForm.get('email')?.value).toBe('');
      expect(component.userForm.get('age')?.value).toBe('');
      expect(component.userForm.get('isActive')?.value).toBe(true);
    });

    it('should have form title "Create New User" by default', () => {
      expect(component.formTitle).toBe('Create New User');
    });

    it('should have submit button text "Create User" by default', () => {
      expect(component.submitButtonText).toBe('Create User');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should be valid when all required fields are filled correctly', () => {
      component.userForm.patchValue(validFormData);
      expect(component.userForm.valid).toBeTruthy();
    });

    describe('Name Field Validation', () => {
      it('should be invalid when name is empty', () => {
        const nameControl = component.userForm.get('name');
        nameControl?.setValue('');
        nameControl?.markAsTouched();
        
        expect(nameControl?.invalid).toBeTruthy();
        expect(nameControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid when name is too short', () => {
        const nameControl = component.userForm.get('name');
        nameControl?.setValue('A');
        nameControl?.markAsTouched();
        
        expect(nameControl?.invalid).toBeTruthy();
        expect(nameControl?.errors?.['minlength']).toBeTruthy();
      });

      it('should be invalid when name is only whitespace', () => {
        const nameControl = component.userForm.get('name');
        nameControl?.setValue('   ');
        nameControl?.markAsTouched();
        
        expect(nameControl?.invalid).toBeTruthy();
        expect(nameControl?.errors?.['whitespace']).toBeTruthy();
      });

      it('should be valid with proper name', () => {
        const nameControl = component.userForm.get('name');
        nameControl?.setValue('John Doe');
        
        expect(nameControl?.valid).toBeTruthy();
      });
    });

    describe('Email Field Validation', () => {
      it('should be invalid when email is empty', () => {
        const emailControl = component.userForm.get('email');
        emailControl?.setValue('');
        emailControl?.markAsTouched();
        
        expect(emailControl?.invalid).toBeTruthy();
        expect(emailControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid with malformed email', () => {
        const emailControl = component.userForm.get('email');
        emailControl?.setValue('invalid-email');
        emailControl?.markAsTouched();
        
        expect(emailControl?.invalid).toBeTruthy();
        expect(emailControl?.errors?.['email']).toBeTruthy();
      });

      it('should be invalid with disallowed domain', () => {
        const emailControl = component.userForm.get('email');
        emailControl?.setValue('user@disallowed.com');
        emailControl?.markAsTouched();
        
        expect(emailControl?.invalid).toBeTruthy();
        expect(emailControl?.errors?.['invalidDomain']).toBeTruthy();
      });

      it('should be valid with allowed domain', () => {
        const emailControl = component.userForm.get('email');
        emailControl?.setValue('user@gmail.com');
        
        expect(emailControl?.valid).toBeTruthy();
      });
    });

    describe('Age Field Validation', () => {
      it('should be invalid when age is empty', () => {
        const ageControl = component.userForm.get('age');
        ageControl?.setValue('');
        ageControl?.markAsTouched();
        
        expect(ageControl?.invalid).toBeTruthy();
        expect(ageControl?.errors?.['required']).toBeTruthy();
      });

      it('should be invalid when age is below minimum', () => {
        const ageControl = component.userForm.get('age');
        ageControl?.setValue(17);
        ageControl?.markAsTouched();
        
        expect(ageControl?.invalid).toBeTruthy();
        expect(ageControl?.errors?.['min']).toBeTruthy();
      });

      it('should be invalid when age is above maximum', () => {
        const ageControl = component.userForm.get('age');
        ageControl?.setValue(101);
        ageControl?.markAsTouched();
        
        expect(ageControl?.invalid).toBeTruthy();
        expect(ageControl?.errors?.['max']).toBeTruthy();
      });

      it('should be invalid when age is not an integer', () => {
        const ageControl = component.userForm.get('age');
        ageControl?.setValue(25.5);
        ageControl?.markAsTouched();
        
        expect(ageControl?.invalid).toBeTruthy();
        expect(ageControl?.errors?.['notInteger']).toBeTruthy();
      });

      it('should be valid with proper age', () => {
        const ageControl = component.userForm.get('age');
        ageControl?.setValue(25);
        
        expect(ageControl?.valid).toBeTruthy();
      });
    });
  });

  describe('Input Properties', () => {
    it('should populate form when editUser is provided', () => {
      component.editUser = mockUser;
      component.ngOnInit();
      
      expect(component.userForm.get('name')?.value).toBe(mockUser.name);
      expect(component.userForm.get('email')?.value).toBe(mockUser.email);
      expect(component.userForm.get('age')?.value).toBe(mockUser.age);
      expect(component.userForm.get('isActive')?.value).toBe(mockUser.isActive);
    });

    it('should change form title when editUser is provided', () => {
      component.editUser = mockUser;
      expect(component.formTitle).toBe('Edit User');
    });

    it('should change submit button text when editUser is provided', () => {
      component.editUser = mockUser;
      expect(component.submitButtonText).toBe('Update User');
    });

    it('should disable submit button when isLoading is true', () => {
      component.userForm.patchValue(validFormData);
      component.isLoading = true;
      
      expect(component.canSubmit).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.userForm.patchValue(validFormData);
    });

    it('should emit userSubmitted event with correct data on valid form submission', fakeAsync(() => {
      spyOn(component.userSubmitted, 'emit');
      
      component.onSubmit();
      
      const expectedRequest: CreateUserRequest = {
        name: validFormData.name,
        email: validFormData.email.toLowerCase(),
        age: validFormData.age
      };
      
      expect(component.userSubmitted.emit).toHaveBeenCalledWith(expectedRequest);
    }));

    it('should set isSubmitting to true during submission', () => {
      component.onSubmit();
      expect(component.isSubmitting).toBeTruthy();
    });

    it('should not submit when form is invalid', () => {
      component.userForm.patchValue({ name: '', email: '', age: '' });
      spyOn(component.userSubmitted, 'emit');
      
      component.onSubmit();
      
      expect(component.userSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.userForm.patchValue({ name: '', email: '', age: '' });
      
      component.onSubmit();
      
      expect(component.userForm.get('name')?.touched).toBeTruthy();
      expect(component.userForm.get('email')?.touched).toBeTruthy();
      expect(component.userForm.get('age')?.touched).toBeTruthy();
    });

    it('should reset form after successful submission', fakeAsync(() => {
      component.onSubmit();
      tick(1000);
      
      expect(component.userForm.get('name')?.value).toBe('');
      expect(component.userForm.get('email')?.value).toBe('');
      expect(component.userForm.get('age')?.value).toBe('');
      expect(component.userForm.get('isActive')?.value).toBe(true);
    }));
  });

  describe('Form Cancellation', () => {
    it('should emit formCancelled event when cancel is clicked', () => {
      spyOn(component.formCancelled, 'emit');
      
      component.onCancel();
      
      expect(component.formCancelled.emit).toHaveBeenCalled();
    });

    it('should reset form when cancel is clicked', () => {
      component.userForm.patchValue(validFormData);
      
      component.onCancel();
      
      expect(component.userForm.get('name')?.value).toBe('');
      expect(component.userForm.get('email')?.value).toBe('');
      expect(component.userForm.get('age')?.value).toBe('');
      expect(component.userForm.get('isActive')?.value).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return correct error message for required field', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      
      expect(component.getFieldError('name')).toBe('Name is required');
    });

    it('should return correct error message for minlength validation', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('A');
      nameControl?.markAsTouched();
      
      expect(component.getFieldError('name')).toBe('Name must be at least 2 characters');
    });

    it('should return correct error message for email validation', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      
      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    });

    it('should return null when field has no errors', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('John Doe');
      
      expect(component.getFieldError('name')).toBeNull();
    });

    it('should detect field errors correctly', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      
      expect(component.hasFieldError('name')).toBeTruthy();
    });
  });

  describe('DOM Interactions', () => {
    it('should display form title in header', () => {
      const headerElement = compiled.querySelector('.form-header h2');
      expect(headerElement?.textContent).toBe('Create New User');
    });

    it('should display error messages when fields are invalid and touched', () => {
      const nameInput = compiled.querySelector('#name') as HTMLInputElement;
      const nameControl = component.userForm.get('name');
      
      nameInput.value = '';
      nameInput.dispatchEvent(new Event('input'));
      nameInput.dispatchEvent(new Event('blur'));
      nameControl?.markAsTouched();
      fixture.detectChanges();
      
      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage?.textContent?.trim()).toBe('Name is required');
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.userForm.patchValue(validFormData);
      fixture.detectChanges();
      
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBeFalsy();
    });

    it('should call onSubmit when form is submitted', () => {
      spyOn(component, 'onSubmit');
      component.userForm.patchValue(validFormData);
      fixture.detectChanges();
      
      const form = compiled.querySelector('form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit'));
      
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', () => {
      spyOn(component, 'onCancel');
      
      const cancelButton = compiled.querySelector('button[type="button"]') as HTMLButtonElement;
      cancelButton.click();
      
      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      const nameLabel = compiled.querySelector('label[for="name"]');
      const emailLabel = compiled.querySelector('label[for="email"]');
      const ageLabel = compiled.querySelector('label[for="age"]');
      
      expect(nameLabel).toBeTruthy();
      expect(emailLabel).toBeTruthy();
      expect(ageLabel).toBeTruthy();
    });

    it('should have required indicators', () => {
      const requiredSpans = compiled.querySelectorAll('.required');
      expect(requiredSpans.length).toBe(3); // name, email, age
    });

    it('should have proper input types', () => {
      const nameInput = compiled.querySelector('#name') as HTMLInputElement;
      const emailInput = compiled.querySelector('#email') as HTMLInputElement;
      const ageInput = compiled.querySelector('#age') as HTMLInputElement;
      
      expect(nameInput.type).toBe('text');
      expect(emailInput.type).toBe('email');
      expect(ageInput.type).toBe('number');
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should clean up subscriptions on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });

    it('should clear submit error when form values change', () => {
      component.submitError = 'Test error';
      
      component.userForm.get('name')?.setValue('New Name');
      
      expect(component.submitError).toBeNull();
    });
  });
});
