import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService, Student, StudentFilters, StudentResponse } from './student.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddStudentModalComponent } from './add-student-modal/add-student-modal.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    AddStudentModalComponent
  ],
  template: `
    <div class="students-container">
      <header class="students-header">
        <h2>Students</h2>
        <div class="header-actions">
          <form [formGroup]="filterForm" class="filter-form">
            <select formControlName="status" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </form>
          <button class="btn-primary" (click)="openAddStudentModal()">Add Student</button>
        </div>
      </header>

      <div class="students-table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students">
              <td>{{student.student_id}}</td>
              <td>{{student.user.first_name}} {{student.user.last_name}}</td>
              <td>{{student.user.email}}</td>
              <td>{{student.contact}}</td>
              <td>
                <span class="status-badge" [class.active]="student.user.status === 'active'">
                  {{student.user.status}}
                </span>
              </td>
              <td>{{student.enrolled_courses_count}}</td>
              <td class="actions">
                <button class="btn-icon" (click)="viewDetails(student)">View</button>
                <button class="btn-icon" (click)="editStudent(student)">Edit</button>
                <button class="btn-icon" (click)="toggleStatus(student)">
                  {{student.user.status === 'active' ? 'Deactivate' : 'Activate'}}
                </button>
                <button class="btn-icon delete-btn" (click)="deleteStudent(student)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button 
          *ngFor="let page of getPages()" 
          [class.active]="page === currentPage"
          (click)="changePage(page)">
          {{page}}
        </button>
      </div>

      <!-- Custom Delete Confirmation Dialog -->
      <div class="modal-overlay" *ngIf="showDeleteDialog" (click)="cancelDelete()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="warning-icon">!</div>
            <h2>Delete Student</h2>
          </div>
          
          <div class="modal-content">
            <p class="message">Are you sure you want to delete this student?</p>
            <p class="student-name" *ngIf="studentToDelete">
              {{studentToDelete.user.first_name}} {{studentToDelete.user.last_name}}
            </p>
            <p class="warning-text">This action cannot be undone.</p>
          </div>
          
          <div class="modal-actions">
            <button class="btn cancel" (click)="cancelDelete()">Cancel</button>
            <button class="btn delete" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 2rem;
    }

    .students-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .filter-form {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .students-table-container {
      overflow-x: auto;
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .students-table th,
    .students-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .students-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      text-transform: capitalize;
      background: #dc3545;
      color: white;
    }

    .status-badge.active {
      background: #28a745;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #007bff;
      color: white;
      font-size: 0.875rem;
    }

    .btn-icon:hover {
      background: #0056b3;
    }

    .delete-btn {
      background: #dc3545;
    }

    .delete-btn:hover {
      background: #c82333;
    }

    .btn-primary {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #28a745;
      color: white;
      font-size: 0.875rem;
    }

    .btn-primary:hover {
      background: #218838;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
    }

    .pagination button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    /* Custom Dialog Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-container {
      background: white;
      border-radius: 0.8rem;
      width: 40rem;
      box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-2rem);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.6rem;
      border-bottom: 0.1rem solid #eee;
    }

    .warning-icon {
      width: 3.2rem;
      height: 3.2rem;
      background: #ff4444;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.4rem;
      font-weight: bold;
    }

    .modal-content {
      padding: 2rem;
    }

    .message {
      font-size: 1.6rem;
      color: #666;
      margin: 0 0 1.6rem 0;
    }

    .student-name {
      font-size: 1.8rem;
      font-weight: 500;
      color: #333;
      padding: 1.2rem 1.6rem;
      background: #f8f9fa;
      border-radius: 0.4rem;
      margin: 1.2rem 0;
    }

    .warning-text {
      font-size: 1.4rem;
      color: #ff4444;
      margin: 1.2rem 0 0 0;
    }

    .modal-actions {
      padding: 1.6rem 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1.2rem;
      border-top: 0.1rem solid #eee;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 0.4rem;
      font-size: 1.4rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .cancel {
      background: #f8f9fa;
      color: #666;
      border: 0.1rem solid #ddd;
    }

    .cancel:hover {
      background: #e9ecef;
    }

    .delete {
      background: #ff4444;
      color: white;
    }

    .delete:hover {
      background: #cc0000;
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  filterForm: FormGroup;
  showDeleteDialog = false;
  studentToDelete: Student | null = null;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      status: ['']
    });
  }

  ngOnInit() {
    this.loadStudents();
    this.setupFilterSubscriptions();
  }

  loadStudents() {
    const filters: StudentFilters = {
      page: this.currentPage,
      page_size: this.pageSize,
      status: this.filterForm.get('status')?.value || undefined
    };

    this.studentService.getStudents(filters).subscribe({
      next: (response) => {
        if ('results' in response) {
          // It's a StudentResponse
          this.students = response.results;
          this.totalPages = Math.ceil(response.count / this.pageSize);
        } else {
          // It's a Student[]
          this.students = response;
          this.totalPages = 1; // Since there's no pagination info in this case
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  private setupFilterSubscriptions() {
    this.filterForm.get('status')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadStudents();
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadStudents();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAddStudentModal() {
    const dialogRef = this.dialog.open(AddStudentModalComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents(); // Refresh the student list after adding
      }
    });
  }

  editStudent(student: Student) {
    // Implement edit student modal
    console.log('Edit student:', student);
  }

  viewDetails(student: Student) {
    // Implement view student details
    console.log('View student details:', student);
  }

  toggleStatus(student: Student) {
    const newStatus = student.user.status === 'active' ? 'inactive' : 'active';
    this.studentService.updateStatus(student.id, newStatus).subscribe({
      next: () => {
        student.user.status = newStatus;
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  deleteStudent(student: Student) {
    this.studentToDelete = student;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.studentToDelete = null;
  }

  confirmDelete() {
    if (this.studentToDelete) {
      this.studentService.deleteStudent(this.studentToDelete.id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== this.studentToDelete!.id);
          this.showDeleteDialog = false;
          this.studentToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          this.showDeleteDialog = false;
          this.studentToDelete = null;
        }
      });
    }
  }
}
