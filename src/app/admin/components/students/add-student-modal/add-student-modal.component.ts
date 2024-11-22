import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService, CreateStudentRequest } from '../student.service';

@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Add New Student</h3>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </header>

        <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input 
              id="firstName" 
              type="text" 
              formControlName="firstName"
              [class.error]="isFieldInvalid('firstName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('firstName')">
              First name is required
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input 
              id="lastName" 
              type="text" 
              formControlName="lastName"
              [class.error]="isFieldInvalid('lastName')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('lastName')">
              Last name is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Valid email is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password *</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password is required and must be at least 6 characters long
            </div>
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number *</label>
            <input 
              id="phoneNumber" 
              type="tel" 
              formControlName="phoneNumber"
              [class.error]="isFieldInvalid('phoneNumber')"
            >
            <div class="error-message" *ngIf="isFieldInvalid('phoneNumber')">
              Valid phone number is required (10 digits)
            </div>
          </div>

          <div class="form-group">
            <label for="contact">Alternative Contact</label>
            <input 
              id="contact" 
              type="tel" 
              formControlName="contact"
            >
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input 
              id="dateOfBirth" 
              type="date" 
              formControlName="dateOfBirth"
            >
          </div>

          <div class="form-group">
            <label for="qualification">Qualification</label>
            <input 
              id="qualification" 
              type="text" 
              formControlName="qualification"
            >
          </div>

          <div class="form-group">
            <label for="bloodGroup">Blood Group</label>
            <input 
              id="bloodGroup" 
              type="text" 
              formControlName="bloodGroup"
            >
          </div>

          <div class="form-group">
            <label for="medicalConditions">Medical Conditions</label>
            <textarea 
              id="medicalConditions" 
              formControlName="medicalConditions"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="profilePhoto">Profile Photo</label>
            <input 
              id="profilePhoto" 
              type="file" 
              (change)="onFileSelected($event)"
            >
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="studentForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Adding...' : 'Add Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 0.8rem;
      padding: 2rem;
      width: 90%;
      max-width: 60rem;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2.4rem;
      cursor: pointer;
      padding: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.6rem;
    }

    label {
      display: block;
      margin-bottom: 0.8rem;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.4rem;
      font-size: 1.4rem;
    }

    input.error, select.error, textarea.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 1.2rem;
      margin-top: 0.4rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 1rem 2rem;
      border-radius: 0.4rem;
      font-size: 1.4rem;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
    }
  `]
})
export class AddStudentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() studentAdded = new EventEmitter<void>();

  studentForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;  // Track selected file
  private profilePhotoBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.pattern('^[0-9]{10}$')],  
      contact: [''],  
      dateOfBirth: [''],
      qualification: [''],
      bloodGroup: [''],
      medicalConditions: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onClose() {
    this.close.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      // Convert to base64 if needed
      this.convertFileToBase64(input.files[0]);
    }
  }

  private convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePhotoBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      
      const studentData: CreateStudentRequest = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        contact: formData.contact || undefined,
        qualification: formData.qualification || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        blood_group: formData.bloodGroup || undefined,
        medical_conditions: formData.medicalConditions || null,
        profile_photo: this.profilePhotoBase64 || undefined
      };

      this.studentService.createStudent(studentData).subscribe({
        next: (response) => {
          this.studentAdded.emit();
          this.close.emit();
        },
        error: (error) => {
          let errorMessage = 'Failed to create student';
          if (error.error && typeof error.error === 'object') {
            errorMessage = Object.entries(error.error)
              .map(([field, msgs]) => `${field}: ${msgs}`)
              .join('\n');
          }
        }
      });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}
