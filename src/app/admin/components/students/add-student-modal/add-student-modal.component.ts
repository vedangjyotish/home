import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { 
  MatNativeDateModule, 
  DateAdapter, 
  MAT_DATE_FORMATS, 
  MAT_DATE_LOCALE,
  NativeDateAdapter 
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
  details?: { [key: string]: string };
}

@Component({
  selector: 'app-add-student-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageCropperComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  template: `
    <div class="modal-overlay" (click)="$event.stopPropagation()">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Student</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <div *ngIf="statusMessage" [ngClass]="['status-message', statusMessage.type]">
          <p class="status-title">{{ statusMessage.type === 'success' ? 'Success!' : 'Error' }}</p>
          <p class="status-text">{{ statusMessage.message }}</p>
          <ul *ngIf="statusMessage.type === 'error' && statusMessage.details" class="status-details">
            <li *ngFor="let error of getErrorDetails()">{{ error }}</li>
          </ul>
        </div>
        
        <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="student-form">
          <div class="form-section">
            <h3>Basic Information</h3>
            
            <div class="form-group">
              <div class="input-wrapper">
                <input type="email" id="email" formControlName="email" placeholder=" ">
                <label for="email">Email Address</label>
                <div class="input-highlight"></div>
              </div>
              <div class="error-message" *ngIf="studentForm.get('email')?.touched && studentForm.get('email')?.invalid">
                {{ getErrorMessage('email') }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <div class="input-wrapper">
                  <input type="password" id="password" formControlName="password" placeholder=" ">
                  <label for="password">Password</label>
                  <div class="input-highlight"></div>
                </div>
                <div class="error-message" *ngIf="studentForm.get('password')?.touched && studentForm.get('password')?.invalid">
                  {{ getErrorMessage('password') }}
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <input type="password" id="confirm_password" formControlName="confirm_password" placeholder=" ">
                  <label for="confirm_password">Confirm Password</label>
                  <div class="input-highlight"></div>
                </div>
                <div class="error-message" *ngIf="studentForm.get('confirm_password')?.touched && 
                  (studentForm.get('confirm_password')?.invalid || studentForm.hasError('passwordMismatch'))">
                  {{ getErrorMessage('confirm_password') }}
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <div class="input-wrapper">
                  <input type="text" id="firstName" formControlName="first_name" placeholder=" ">
                  <label for="firstName">First Name</label>
                  <div class="input-highlight"></div>
                </div>
                <div class="error-message" *ngIf="studentForm.get('first_name')?.touched && studentForm.get('first_name')?.invalid">
                  {{ getErrorMessage('first_name') }}
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper">
                  <input type="text" id="lastName" formControlName="last_name" placeholder=" ">
                  <label for="lastName">Last Name</label>
                  <div class="input-highlight"></div>
                </div>
                <div class="error-message" *ngIf="studentForm.get('last_name')?.touched && studentForm.get('last_name')?.invalid">
                  {{ getErrorMessage('last_name') }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <input type="tel" id="phoneNumber" formControlName="phone_number" placeholder=" ">
                <label for="phoneNumber">Phone Number</label>
                <div class="input-highlight"></div>
              </div>
              <div class="error-message" *ngIf="studentForm.get('phone_number')?.touched && studentForm.get('phone_number')?.invalid">
                {{ getErrorMessage('phone_number') }}
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Additional Details</h3>
            
            <div class="form-row">
              <div class="form-group">
                <div class="input-wrapper">
                  <input type="text" id="qualification" formControlName="qualification" placeholder=" ">
                  <label for="qualification">Qualification</label>
                  <div class="input-highlight"></div>
                </div>
              </div>

              <div class="form-group">
                <div class="input-wrapper date-wrapper">
                  <mat-form-field class="custom-form-field" appearance="outline">
                    <mat-label>Date of Birth</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="date_of_birth" [max]="maxDate" placeholder=" ">
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>
                </div>
                <div class="error-message" *ngIf="studentForm.get('date_of_birth')?.touched && studentForm.get('date_of_birth')?.invalid">
                  {{ getErrorMessage('date_of_birth') }}
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Profile Photo</h3>
              <div class="form-group">
                <div class="file-upload" (click)="triggerFileInput()" *ngIf="!showCropper">
                  <input #fileInput type="file" id="fileInput" (change)="onFileSelected($event)" accept="image/png,image/jpeg,image/jpg" style="display: none">
                  <div class="upload-content" *ngIf="!previewUrl">
                    <i class="upload-icon">📷</i>
                    <span>Click to upload profile photo</span>
                    <span class="upload-hint">(JPG, JPEG or PNG, Max: 1MB)</span>
                  </div>
                  <div class="preview-container" *ngIf="previewUrl">
                    <img [src]="previewUrl" class="preview-image" alt="Profile preview">
                    <div class="preview-overlay">
                      <span>Click to change</span>
                    </div>
                  </div>
                </div>

                <!-- Image Cropper -->
                <div class="cropper-container" *ngIf="showCropper">
                  <image-cropper
                    [imageChangedEvent]="imageChangedEvent"
                    [maintainAspectRatio]="true"
                    [aspectRatio]="1"
                    [roundCropper]="true"
                    [alignImage]="'center'"
                    format="png"
                    (imageCropped)="imageCropped($event)"
                    (loadImageFailed)="loadImageFailed()"
                    [transform]="transform"
                  ></image-cropper>
                  <div class="cropper-actions">
                    <button type="button" class="btn btn-secondary" (click)="cancelCropping()">Cancel</button>
                    <button type="button" class="btn btn-primary" (click)="saveCroppedImage()">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!studentForm.valid || isSubmitting">
              {{isSubmitting ? 'Adding...' : 'Add Student'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(8px);
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 460px;
      max-height: 85vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 
        0 0 0 1px rgba(0, 0, 0, 0.05),
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: modal-in 0.3s cubic-bezier(0.2, 0.0, 0, 1.0);
    }

    @keyframes modal-in {
      0% { 
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-header {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f3f4f6;
      background: linear-gradient(to right, #ffffff, #f9fafb);
      border-radius: 24px 24px 0 0;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .modal-header h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .close-btn {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      border: none;
      background: #f3f4f6;
      color: #6b7280;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #e5e7eb;
      color: #374151;
      transform: rotate(90deg);
    }

    .student-form {
      padding: 1.25rem;
    }

    .form-section {
      margin-bottom: 2rem;
      animation: section-in 0.4s ease-out;
      animation-fill-mode: both;
    }

    .form-section:nth-child(2) {
      animation-delay: 0.1s;
    }

    @keyframes section-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-section h3 {
      font-size: 1.6rem;
      font-weight: 600;
      color: #6b7280;
      margin: 0 0 1.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .form-section h3::after {
      content: "";
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, #e5e7eb 50%, transparent);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .input-wrapper {
      position: relative;
      margin-top: 0.5rem;
    }

    .input-wrapper input {
      width: 100%;
      padding: 1.2rem 1.6rem;
      font-size: 1.4rem;
      border: 1px solid #e5e7eb;
      border-radius: 1.2rem;
      background: #f9fafb;
      transition: all 0.2s;
      outline: none;
      color: #111827;
    }

    .input-wrapper input:focus {
      border-color: #6366f1;
      background: white;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .input-wrapper label {
      position: absolute;
      left: 1.6rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.4rem;
      color: #6b7280;
      pointer-events: none;
      transition: all 0.2s;
      padding: 0 0.25rem;
      background: transparent;
    }

    .input-wrapper input:focus ~ label,
    .input-wrapper input:not(:placeholder-shown) ~ label {
      top: -0.5rem;
      left: 1rem;
      font-size: 1.2rem;
      color: #6366f1;
      background: white;
    }

    .input-highlight {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: #6366f1;
      transition: all 0.2s;
    }

    .input-wrapper input:focus ~ .input-highlight {
      width: 100%;
      left: 0;
    }

    .error-message {
      font-size: 1.2rem;
      color: #ef4444;
      margin-top: 0.8rem;
      animation: error-in 0.2s ease-out;
      padding-left: 1.6rem;
    }

    @keyframes error-in {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .file-upload {
      width: 100%;
      height: 120px;
      border: 2px dashed #e5e7eb;
      border-radius: 16px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .file-upload:hover {
      border-color: #6366f1;
      background: #f3f4f6;
    }

    .upload-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #6b7280;
      font-size: 1.4rem;
    }

    .upload-icon {
      font-size: 2.4rem;
      opacity: 0.8;
    }

    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 1.2rem;
      overflow: hidden;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .preview-overlay span {
      color: white;
      font-size: 1.4rem;
    }

    .preview-container:hover .preview-overlay {
      opacity: 1;
    }

    .preview-container:hover .preview-image {
      transform: scale(1.05);
    }

    .upload-hint {
      font-size: 1.2rem;
      color: #9ca3af;
    }

    .date-wrapper input[type="date"] {
      appearance: none;
      -webkit-appearance: none;
      color: #111827;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .date-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
      background: transparent;
      bottom: 0;
      color: transparent;
      cursor: pointer;
      height: auto;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: auto;
    }

    .date-wrapper input[type="date"]::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }

    .custom-form-field {
      width: 100%;
    }

    ::ng-deep .custom-form-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .custom-form-field .mat-mdc-text-field-wrapper {
      padding: 0;
      height: 40px;
      background-color: white !important;
    }

    ::ng-deep .custom-form-field .mat-mdc-form-field-flex {
      height: 40px;
      padding: 0 12px !important;
      background-color: white !important;
    }

    ::ng-deep .custom-form-field .mdc-notched-outline {
      border-radius: 4px;
    }

    ::ng-deep .custom-form-field .mdc-notched-outline__leading,
    ::ng-deep .custom-form-field .mdc-notched-outline__notch,
    ::ng-deep .custom-form-field .mdc-notched-outline__trailing {
      border-color: #ddd !important;
    }

    ::ng-deep .custom-form-field .mat-mdc-form-field-infix {
      padding: 8px 0 !important;
      min-height: unset;
    }

    ::ng-deep .custom-form-field .mat-mdc-text-field-wrapper.mdc-text-field--outlined .mat-mdc-form-field-infix {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
    }

    ::ng-deep .mat-datepicker-content {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    }

    ::ng-deep .mat-calendar-body-selected {
      background-color: #28a745 !important;
    }

    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: #28a745;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: #666;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f3f4f6;
    }

    .btn {
      padding: 1.2rem 2rem;
      font-size: 1.4rem;
      font-weight: 500;
      border-radius: 1rem;
      transition: all 0.2s;
      cursor: pointer;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .btn-primary:disabled {
      background: #c7d2fe;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #4b5563;
      border: 1px solid #e5e7eb;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .cropper-container {
      background: #f3f4f6;
      border-radius: 1.2rem;
      overflow: hidden;
      max-height: 400px;
      margin-top: 1.6rem;
    }

    .cropper-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.2rem;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    :host ::ng-deep {
      .cropper {
        background: #f3f4f6 !important;
      }
      
      .source-image {
        max-height: 300px !important;
      }

      .overlay {
        outline: rgba(99, 102, 241, 0.3) solid 100vw !important;
      }

      .cropper {
        border: 2px solid #6366f1 !important;
      }
    }

    .mat-form-field {
      width: 100%;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      background-color: white;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #ddd;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-start,
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-end {
      border-radius: 4px;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: #666;
    }

    ::ng-deep .mat-calendar {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    ::ng-deep .mat-calendar-body-selected {
      background-color: #28a745;
    }

    .status-message {
      border-radius: 0.8rem;
      padding: 1.6rem 2rem;
      margin: 1.6rem 2.4rem 2.4rem 2.4rem;
    }

    .status-message.success {
      background-color: #dcfce7;
      border: 1px solid #22c55e;
    }

    .status-message.error {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
    }

    .status-title {
      font-weight: 600;
      font-size: 1.6rem;
      margin: 0 0 0.8rem 0;
    }

    .success .status-title {
      color: #15803d;
    }

    .error .status-title {
      color: #b91c1c;
    }

    .status-text {
      font-size: 1.4rem;
      line-height: 1.5;
      margin: 0;
    }

    .success .status-text {
      color: #166534;
    }

    .error .status-text {
      color: #991b1b;
    }

    .status-details {
      margin: 1.2rem 0 0 0;
      padding: 0 0 0 2rem;
      list-style-type: disc;
    }

    .status-details li {
      color: #991b1b;
      font-size: 1.4rem;
      margin-bottom: 0.8rem;
      line-height: 1.5;
    }

    .status-details li:last-child {
      margin-bottom: 0;
    }
  `]
})
export class AddStudentModalComponent implements OnInit {
  @Output() studentAdded = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  studentForm: FormGroup;
  previewUrl: string | null = null;
  isSubmitting = false;
  maxDate = new Date().toISOString().split('T')[0];
  statusMessage: StatusMessage | null = null;
  
  // Image cropper properties
  imageChangedEvent: any = null;
  showCropper = false;
  croppedImage: string | null = null;
  transform: ImageTransform = { scale: 1 };

  constructor(
    private dialogRef: MatDialogRef<AddStudentModalComponent>,
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      phone_number: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,12}$')]],
      qualification: [''],
      date_of_birth: ['', [Validators.required]],
      profile_photo: [null]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
      control?.valueChanges.subscribe(() => {
        if (control.invalid && (control.dirty || control.touched)) {
          this.getErrorMessage(key);
        }
      });
    });
  }

  passwordMatchValidator(g: FormGroup): ValidationErrors | null {
    return g.get('password')?.value === g.get('confirm_password')?.value
      ? null
      : { passwordMismatch: true };
  }

  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${fieldName.replace('_', ' ').charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    
    if (control.hasError('pattern')) {
      switch(fieldName) {
        case 'first_name':
        case 'last_name':
          return 'Only letters and spaces are allowed';
        case 'phone_number':
          return 'Please enter a valid phone number (10-12 digits, can start with +)';
        default:
          return 'Invalid format';
      }
    }
    
    if (fieldName === 'confirm_password' && this.studentForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  getErrorDetails(): string[] {
    if (!this.statusMessage?.details) return [];
    return Object.entries(this.statusMessage.details).map(([field, message]) => {
      const formattedField = field.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return `${formattedField}: ${message}`;
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG and PNG images are allowed');
        return;
      }
      
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size cannot exceed 1MB');
        return;
      }

      this.imageChangedEvent = event;
      this.showCropper = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64;
    }
  }

  loadImageFailed() {
    alert('Failed to load image. Please try another image.');
    this.cancelCropping();
  }

  cancelCropping() {
    this.showCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.fileInput.nativeElement.value = '';
  }

  saveCroppedImage() {
    if (this.croppedImage) {
      this.previewUrl = this.croppedImage;
      this.showCropper = false;
      
      // Convert base64 to File object
      fetch(this.croppedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'profile_photo.png', { type: 'image/png' });
          this.studentForm.patchValue({
            profile_photo: file
          });
        });
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.isSubmitting = true;
      this.statusMessage = null; // Clear previous messages

      // Create the request data
      const studentData: any = {
        email: this.studentForm.get('email')?.value,
        password: this.studentForm.get('password')?.value,
        first_name: this.studentForm.get('first_name')?.value,
        last_name: this.studentForm.get('last_name')?.value,
        phone_number: this.studentForm.get('phone_number')?.value,
        qualification: this.studentForm.get('qualification')?.value,
        date_of_birth: this.studentForm.get('date_of_birth')?.value,
      };

      // Add profile photo if available
      if (this.croppedImage) {
        studentData.profile_photo = this.croppedImage;
      }

      this.studentService.createStudent(studentData).subscribe({
        next: (response) => {
          this.statusMessage = {
            type: 'success',
            message: 'Student created successfully!'
          };
          
          // Close dialog with true result to indicate success
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.error) {
            this.statusMessage = {
              type: 'error',
              message: error.error.error,
              details: error.error.details
            };
          } else {
            this.statusMessage = {
              type: 'error',
              message: 'Failed to create student. Please try again later.'
            };
          }
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
