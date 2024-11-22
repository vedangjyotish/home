import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from './student.service';

@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Add New Student</h2>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </div>

        <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="student-form">
          <div class="form-section">
            <h3>Required Information</h3>
            
            <div class="form-group">
              <label for="email">Email*</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                placeholder="student@example.com"
              >
              <div class="error-message" *ngIf="studentForm.get('email')?.touched && studentForm.get('email')?.errors?.['required']">
                Email is required
              </div>
              <div class="error-message" *ngIf="studentForm.get('email')?.touched && studentForm.get('email')?.errors?.['email']">
                Please enter a valid email
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password*</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password"
                placeholder="Enter secure password"
              >
              <div class="error-message" *ngIf="studentForm.get('password')?.touched && studentForm.get('password')?.errors?.['required']">
                Password is required
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name*</label>
                <input 
                  type="text" 
                  id="firstName" 
                  formControlName="firstName"
                  placeholder="John"
                >
                <div class="error-message" *ngIf="studentForm.get('firstName')?.touched && studentForm.get('firstName')?.errors?.['required']">
                  First name is required
                </div>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name*</label>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName"
                  placeholder="Doe"
                >
                <div class="error-message" *ngIf="studentForm.get('lastName')?.touched && studentForm.get('lastName')?.errors?.['required']">
                  Last name is required
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number*</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                formControlName="phoneNumber"
                placeholder="+919876543210"
              >
              <div class="error-message" *ngIf="studentForm.get('phoneNumber')?.touched && studentForm.get('phoneNumber')?.errors?.['required']">
                Phone number is required
              </div>
              <div class="error-message" *ngIf="studentForm.get('phoneNumber')?.touched && studentForm.get('phoneNumber')?.errors?.['pattern']">
                Please enter a valid phone number with country code (e.g., +919876543210)
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Optional Information</h3>
            
            <div class="form-group">
              <label for="qualification">Qualification</label>
              <input 
                type="text" 
                id="qualification" 
                formControlName="qualification"
                placeholder="B.Tech"
              >
            </div>

            <div class="form-group">
              <label for="contact">Alternative Contact</label>
              <input 
                type="tel" 
                id="contact" 
                formControlName="contact"
                placeholder="+919876543210"
              >
              <div class="error-message" *ngIf="studentForm.get('contact')?.touched && studentForm.get('contact')?.errors?.['pattern']">
                Please enter a valid phone number with country code
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  formControlName="dateOfBirth"
                >
              </div>

              <div class="form-group">
                <label for="bloodGroup">Blood Group</label>
                <select id="bloodGroup" formControlName="bloodGroup">
                  <option value="">Select Blood Group</option>
                  <option *ngFor="let group of bloodGroups" [value]="group">
                    {{group}}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="medicalConditions">Medical Conditions</label>
              <textarea 
                id="medicalConditions" 
                formControlName="medicalConditions"
                placeholder="Any medical conditions or allergies"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="profilePhoto">Profile Photo</label>
              <input 
                type="file" 
                id="profilePhoto" 
                (change)="onFileSelected($event)"
                accept="image/*"
              >
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="studentForm.invalid || isSubmitting"
            >
              {{isSubmitting ? 'Creating...' : 'Create Student'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-size: 10px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal-header h2 {
      font-size: 2.4rem;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2.4rem;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
    }

    .student-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }

    .form-section h3 {
      font-size: 1.8rem;
      margin: 0;
      color: #666;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.6rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    label {
      font-size: 1.4rem;
      font-weight: 500;
      color: #333;
    }

    input, select, textarea {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1.4rem;
      width: 100%;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
    }

    .error-message {
      color: #dc3545;
      font-size: 1.2rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.2rem;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1.4rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background: #28a745;
      color: white;
    }

    .btn-primary:hover {
      background: #218838;
    }

    .btn-primary:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AddStudentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() studentAdded = new EventEmitter<void>();

  studentForm: FormGroup;
  isSubmitting = false;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{10,14}$/)]],
      qualification: [''],
      contact: ['', Validators.pattern(/^\+[1-9]\d{10,14}$/)],
      dateOfBirth: [''],
      bloodGroup: [''],
      medicalConditions: [''],
    });
  }

  onClose() {
    this.close.emit();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (this.studentForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.studentForm.value;

    let profilePhotoBase64: string | null = null;
    if (this.selectedFile) {
      profilePhotoBase64 = await this.convertFileToBase64(this.selectedFile);
    }

    const studentData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      qualification: formData.qualification || null,
      contact: formData.contact || null,
      date_of_birth: formData.dateOfBirth || null,
      blood_group: formData.bloodGroup || null,
      medical_conditions: formData.medicalConditions || null,
      profile_photo: profilePhotoBase64
    };

    this.studentService.createStudent(studentData).subscribe({
      next: () => {
        this.studentAdded.emit();
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating student:', error);
        // Handle error (show notification)
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
