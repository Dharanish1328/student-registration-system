import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit, OnDestroy {
  studentForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  errorDetails: any = null;
  isLoading = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      gender: ['', Validators.required],
      course: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // Custom validator for email domain
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (email && !email.includes('@')) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Custom validator for age (must be at least 16 years old)
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 16 ? null : { underAge: true };
  }

  // Helper method to get form controls
  get f() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.errorDetails = null;
    this.successMessage = '';

    this.subscription.add(
      this.studentService.addStudent(this.studentForm.value).subscribe({
        next: (response) => {
          this.successMessage = '✨ Student Registered Successfully! ✨';
          this.studentForm.reset();
          this.isLoading = false;
          
          // Reset form validation states
          Object.keys(this.studentForm.controls).forEach(key => {
            const control = this.studentForm.get(key);
            control?.markAsPristine();
            control?.markAsUntouched();
          });
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('Registration error:', err);
          
          // Handle different error status codes
          if (err.status === 409) {
            this.errorMessage = 'A student with this email already exists!';
            this.errorDetails = {
              type: 'duplicate',
              message: 'Please use a different email address or contact support if you believe this is an error.'
            };
            // Highlight the email field
            this.f['email'].setErrors({ duplicate: true });
            this.f['email'].markAsTouched();
          } 
          else if (err.status === 400) {
            this.errorMessage = 'Invalid form data. Please check your inputs.';
            this.errorDetails = err.error?.errors || { message: 'Please review the form and try again.' };
          }
          else if (err.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
            this.errorDetails = {
              type: 'server',
              message: 'Our team has been notified. Please try again in a few moments.'
            };
          }
          else {
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
            this.errorDetails = err.error;
          }
          
          this.isLoading = false;
          
          // Clear error message after 8 seconds for 409 errors (longer to ensure user sees it)
          const timeoutDuration = err.status === 409 ? 8000 : 5000;
          setTimeout(() => {
            this.errorMessage = '';
            this.errorDetails = null;
          }, timeoutDuration);
        }
      })
    );
  }

  // Reset form
  resetForm(): void {
    this.studentForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.errorDetails = null;
    
    // Reset validation states
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  // Clear specific error
  clearError(): void {
    this.errorMessage = '';
    this.errorDetails = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}