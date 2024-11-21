import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { CourseService } from '../../services/course.service';
import { ICourse } from '../../interfaces/course.interface';
import { StudentAuthService } from '../auth/student-auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  styleUrls: ['./student-dashboard.component.scss']
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

  ngOnInit(): void {
    this.loadStudentData();
    this.loadEnrolledCourses();
  }

  loadStudentData(): void {
    const user = this.tokenStorage.getUser();
    if (user) {
      this.studentName = user.name || 'Student';
    } else {
      this.router.navigate(['/account']);
    }
  }

  loadEnrolledCourses(): void {
    const user = this.tokenStorage.getUser();
    if (user?.enrolledCourses) {
      user.enrolledCourses.forEach((courseId: string) => {
        this.courseService.getCourseById(courseId).subscribe({
          next: (course: ICourse | undefined) => {
            if (course) {
              const enrichedCourse: IEnrichedCourse = {
                ...course,
                progress: Math.random() * 100, // This should come from actual progress data
                status: this.getStatus(Math.random() * 100)
              };
              this.enrolledCourses.push(enrichedCourse);
              this.updateStatistics();
            } else {
              console.warn(`Course with ID ${courseId} not found`);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error loading course:', error);
          }
        });
      });
    }
  }

  updateStatistics(): void {
    if (this.enrolledCourses.length === 0) return;

    // Calculate total hours learned based on course duration and progress
    this.totalHoursLearned = this.enrolledCourses.reduce((total, course) => {
      // Default to 10 hours if duration is not specified
      const courseDuration = course.duration || 10;
      return total + (courseDuration * (course.progress / 100));
    }, 0);

    // Calculate average completion rate
    this.averageCompletionRate = this.enrolledCourses.reduce((total, course) => {
      return total + course.progress;
    }, 0) / this.enrolledCourses.length;
  }

  getStatus(progress: number): string {
    if (progress === 100) return 'Completed';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  }

  continueCourse(course: ICourse): void {
    // Navigate to course content page
    this.router.navigate(['/course', course.cid]);
  }

  logout(): void {
    this.studentAuthService.logout();
    this.router.navigate(['/account']);
  }
}
