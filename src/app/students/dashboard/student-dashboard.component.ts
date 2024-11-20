import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { CourseService } from '../../services/course.service';
import { ICourse } from '../../interfaces/course.interface';
import { StudentAuthService } from '../auth/student-auth.service';

interface IUser {
  name?: string;
  enrolledCourses?: string[];
}

interface IEnrichedCourse extends ICourse {
  progress: number;
  status: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  enrolledCourses: IEnrichedCourse[] = [];
  totalHoursLearned: number = 0;
  averageCompletionRate: number = 0;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private courseService: CourseService,
    private studentAuthService: StudentAuthService
  ) {}

  ngOnInit() {
    this.loadStudentData();
    this.loadEnrolledCourses();
  }

  private loadStudentData() {
    const user = this.tokenStorage.getUser() as IUser | null;
    if (user) {
      // Capitalize first letter of each word
      this.studentName = user.name ? 
        user.name.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ') 
        : 'Student';
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadEnrolledCourses() {
    const user = this.tokenStorage.getUser() as IUser | null;
    if (user && user.enrolledCourses) {
      // Load each enrolled course
      user.enrolledCourses.forEach((courseId: string) => {
        this.courseService.getCourseById(courseId).subscribe({
          next: (course) => {
            if (course) {
              // Add progress and status properties
              const enrichedCourse: IEnrichedCourse = {
                ...course,
                progress: Math.floor(Math.random() * 100), // Replace with actual progress
                status: this.getStatus(Math.floor(Math.random() * 100)) // Replace with actual status
              };
              this.enrolledCourses.push(enrichedCourse);
              this.updateStatistics();
            }
          }
        });
      });
    }
  }

  private updateStatistics() {
    // Calculate total hours (assuming 10 hours per course for demo)
    this.totalHoursLearned = this.enrolledCourses.length * 10;

    // Calculate average completion rate
    const totalProgress = this.enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
    this.averageCompletionRate = Math.floor(totalProgress / (this.enrolledCourses.length || 1));
  }

  private getStatus(progress: number): string {
    if (progress === 100) return 'Completed';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  }

  continueCourse(course: ICourse) {
    this.router.navigate(['/course', course.cid, 'tabs', 0]);
  }

  logout() {
    this.studentAuthService.logout().subscribe({
      next: () => {
        this.router.navigate(['/account']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
}
