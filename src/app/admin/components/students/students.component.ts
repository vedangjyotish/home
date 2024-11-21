import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService, Student, StudentFilters } from './student.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="students-container">
      <!-- Filters -->
      <div class="filters-section">
        <form [formGroup]="filterForm" class="filters-form">
          <div class="search-box">
            <input
              type="text"
              formControlName="search"
              placeholder="Search students..."
              class="search-input"
            />
          </div>
          <div class="filter-options">
            <select formControlName="status" class="filter-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select formControlName="courseId" class="filter-select">
              <option value="">All Courses</option>
              <option *ngFor="let course of courses" [value]="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>
          <button (click)="openAddStudentModal()" class="add-student-btn">
            Add Student
          </button>
        </form>
      </div>

      <!-- Students Table -->
      <div class="table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Enrolled Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.phone }}</td>
              <td>
                <span [class]="'status-badge ' + student.status">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <div class="courses-list">
                  <span *ngFor="let course of student.courses">
                    {{ course.courseName }}
                  </span>
                </div>
              </td>
              <td class="actions">
                <button (click)="editStudent(student)" class="action-btn edit">
                  Edit
                </button>
                <button (click)="viewDetails(student)" class="action-btn view">
                  View
                </button>
                <button
                  (click)="toggleStatus(student)"
                  class="action-btn"
                  [class.deactivate]="student.status === 'active'"
                  [class.activate]="student.status === 'inactive'"
                >
                  {{ student.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
          (click)="changePage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="page-btn"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          (click)="changePage(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .filters-form {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
    }

    .search-input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1.4rem;
    }

    .filter-options {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1.4rem;
      min-width: 150px;
    }

    .add-student-btn {
      padding: 0.8rem 1.6rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.4rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .add-student-btn:hover {
      background: #c82333;
    }

    .table-container {
      overflow-x: auto;
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1.4rem;
    }

    .students-table th,
    .students-table td {
      padding: 1.2rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .students-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .status-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .courses-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .courses-list span {
      background: #e9ecef;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 1.2rem;
    }

    .actions {
      display: flex;
      gap: 0.8rem;
    }

    .action-btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .action-btn.edit {
      background: #ffc107;
      color: #000;
    }

    .action-btn.view {
      background: #17a2b8;
      color: white;
    }

    .action-btn.deactivate {
      background: #dc3545;
      color: white;
    }

    .action-btn.activate {
      background: #28a745;
      color: white;
    }

    .pagination {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .page-btn {
      padding: 0.6rem 1.2rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.4rem;
    }

    .page-btn:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 1.4rem;
    }

    @media (max-width: 768px) {
      .filters-form {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-options {
        flex-direction: column;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  courses: any[] = []; // Replace with proper Course interface
  filterForm: FormGroup;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      courseId: ['']
    });
  }

  ngOnInit() {
    this.loadStudents();
    this.setupFilterSubscriptions();
  }

  private setupFilterSubscriptions() {
    this.filterForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadStudents();
      });

    this.filterForm.get('status')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadStudents();
    });

    this.filterForm.get('courseId')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadStudents();
    });
  }

  loadStudents() {
    const filters: StudentFilters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.pageSize
    };

    this.studentService.getStudents(filters).subscribe({
      next: (response) => {
        this.students = response.data;
        this.totalPages = Math.ceil(response.total / this.pageSize);
      },
      error: (error) => {
        console.error('Error loading students:', error);
        // Handle error (show notification)
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadStudents();
  }

  openAddStudentModal() {
    // Implement add student modal
  }

  editStudent(student: Student) {
    // Implement edit student modal
  }

  viewDetails(student: Student) {
    // Implement view student details
  }

  toggleStatus(student: Student) {
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    this.studentService.updateStatus(student.id, newStatus).subscribe({
      next: () => {
        student.status = newStatus;
        // Show success notification
      },
      error: (error) => {
        console.error('Error updating status:', error);
        // Show error notification
      }
    });
  }
}
