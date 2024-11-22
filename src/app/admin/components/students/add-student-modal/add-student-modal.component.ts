import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="modal-container">
      <h2 class="modal-title">Add New Student</h2>
      
      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="student-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="first_name" placeholder="Enter first name">
            <mat-error *ngIf="studentForm.get('first_name')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="last_name" placeholder="Enter last name">
            <mat-error *ngIf="studentForm.get('last_name')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Enter email">
          <mat-error *ngIf="studentForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="studentForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="Enter password">
            <mat-error *ngIf="studentForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="studentForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input matInput formControlName="confirm_password" type="password" placeholder="Confirm password">
            <mat-error *ngIf="studentForm.get('confirm_password')?.hasError('required')">
              Please confirm your password
            </mat-error>
            <mat-error *ngIf="studentForm.get('confirm_password')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phone_number" placeholder="Enter phone number">
            <mat-error *ngIf="studentForm.get('phone_number')?.hasError('required')">
              Phone number is required
            </mat-error>
            <mat-error *ngIf="studentForm.get('phone_number')?.hasError('pattern')">
              Please enter a valid phone number with country code (e.g., +919876543210)
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Alternative Contact</mat-label>
            <input matInput formControlName="contact" placeholder="Enter alternative contact">
            <mat-error *ngIf="studentForm.get('contact')?.hasError('pattern')">
              Please enter a valid phone number with country code
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date_of_birth">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Qualification</mat-label>
            <input matInput formControlName="qualification" placeholder="Enter qualification">
          </mat-form-field>
        </div>

        <div class="profile-photo-section">
          <label class="photo-upload-label">Profile Photo</label>
          <div class="photo-upload-container" (click)="triggerFileInput()">
            <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none">
            <div class="upload-placeholder" *ngIf="!previewUrl">
              <mat-icon>add_a_photo</mat-icon>
              <span>Click to upload photo</span>
            </div>
            <img *ngIf="previewUrl" [src]="previewUrl" class="preview-image" alt="Profile preview">
          </div>
        </div>

        <div class="modal-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!studentForm.valid || isSubmitting">
            {{ isSubmitting ? 'Adding...' : 'Add Student' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-container {
      padding: 2.4rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .modal-title {
      font-size: 2.4rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2.4rem;
      text-align: center;
    }

    .student-form {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }

    .form-row {
      display: flex;
      gap: 1.6rem;
    }

    .form-row > * {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .profile-photo-section {
      margin-top: 1.6rem;
    }

    .photo-upload-label {
      font-size: 1.4rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 0.8rem;
      display: block;
    }

    .photo-upload-container {
      width: 100%;
      height: 20rem;
      border: 2px dashed #e5e7eb;
      border-radius: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .photo-upload-container:hover {
      border-color: #6366f1;
      background-color: rgba(99, 102, 241, 0.04);
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      color: #6b7280;
    }

    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.6rem;
      margin-top: 2.4rem;
    }

    :host ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }
  `]
})
export class AddStudentModalComponent {
  @Output() studentAdded = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  studentForm: FormGroup;
  isSubmitting = false;
  previewUrl: string | null = null;
  private profilePhotoBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialogRef: MatDialogRef<AddStudentModalComponent>
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{10,14}$/)]],
      contact: ['', Validators.pattern(/^\+[1-9]\d{10,14}$/)],
      date_of_birth: [''],
      qualification: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.profilePhotoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.isSubmitting = true;
      const formData = this.studentForm.value;
      
      const studentData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        contact: formData.contact || undefined,
        qualification: formData.qualification || undefined,
        date_of_birth: formData.date_of_birth ? 
          new Date(formData.date_of_birth).toISOString().split('T')[0] : undefined,
        profile_photo: this.profilePhotoBase64 || undefined
      };

      this.studentService.createStudent(studentData).subscribe({
        next: () => {
          this.studentAdded.emit();
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating student:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
