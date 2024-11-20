import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { StudentAuthService } from '../auth/student-auth.service';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
}

interface Activity {
  type: 'course' | 'quiz';
  description: string;
  timestamp: Date;
}

@Component({
  selector: 'app-student-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome, {{ studentName }}</h1>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
      
      <div class="dashboard-content">
        <div class="stats-container">
          <div class="stat-card">
            <h3>Enrolled Courses</h3>
            <p class="stat-number">{{ enrolledCoursesCount }}</p>
          </div>
          <div class="stat-card">
            <h3>Completed Courses</h3>
            <p class="stat-number">{{ completedCoursesCount }}</p>
          </div>
          <div class="stat-card">
            <h3>Active Sessions</h3>
            <p class="stat-number">{{ activeSessionsCount }}</p>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div *ngIf="!hasActivity" class="no-activity">No recent activity</div>
          <div *ngIf="hasActivity" class="activity-list">
            <div *ngFor="let activity of recentActivities" class="activity-item">
              <span class="activity-icon" [ngClass]="activity.type">
                <i [class]="getActivityIcon(activity.type)"></i>
              </span>
              <div class="activity-details">
                <p class="activity-text">{{ activity.description }}</p>
                <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="enrolled-courses" *ngIf="enrolledCourses.length > 0">
          <h2>Your Courses</h2>
          <div class="courses-grid">
            <div *ngFor="let course of enrolledCourses" class="course-card">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-progress">
                <div class="progress-bar" [style.width.%]="course.progress"></div>
                <span class="progress-text">{{ course.progress }}% Complete</span>
              </div>
              <button class="continue-btn" (click)="continueCourse(course.id)">Continue Learning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.8rem;
      color: #2c3e50;
      margin: 0;
    }

    .logout-btn {
      padding: 1rem 2rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.6rem;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-card h3 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .stat-number {
      font-size: 3.2rem;
      font-weight: bold;
      color: #e74c3c;
      margin: 0;
    }

    .recent-activity {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .recent-activity h2 {
      font-size: 2.4rem;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .no-activity {
      text-align: center;
      color: #7f8c8d;
      font-size: 1.6rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 1rem;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon.course {
      background-color: #3498db;
      color: white;
    }

    .activity-icon.quiz {
      background-color: #2ecc71;
      color: white;
    }

    .activity-details {
      flex-grow: 1;
    }

    .activity-text {
      margin: 0;
      font-size: 1.4rem;
      color: #2c3e50;
    }

    .activity-time {
      font-size: 1.2rem;
      color: #7f8c8d;
    }

    .enrolled-courses {
      margin-top: 3rem;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .course-card {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .course-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.8rem;
      color: #2c3e50;
    }

    .course-progress {
      margin: 1.5rem 0;
      background-color: #ecf0f1;
      border-radius: 4px;
      height: 8px;
      position: relative;
    }

    .progress-bar {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background-color: #3498db;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      display: block;
      margin-top: 0.5rem;
      font-size: 1.2rem;
      color: #7f8c8d;
    }

    .continue-btn {
      width: 100%;
      padding: 1rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.4rem;
      transition: background-color 0.3s;
    }

    .continue-btn:hover {
      background-color: #2980b9;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  hasActivity: boolean = false;
  enrolledCoursesCount: number = 0;
  completedCoursesCount: number = 0;
  activeSessionsCount: number = 0;
  enrolledCourses: Course[] = [];
  recentActivities: Activity[] = [];

  constructor(
    private tokenStorage: TokenStorageService,
    private studentAuth: StudentAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.tokenStorage.getUser();
    if (!user || user.type !== 'student') {
      this.router.navigate(['/account']);
      return;
    }

    this.studentName = user.name || 'Student';
    this.loadDashboardData();
  }

  loadDashboardData() {
    const user = this.tokenStorage.getUser();
    
    // For now, using dummy data
    this.enrolledCoursesCount = user.enrolledCourses?.length || 0;
    this.completedCoursesCount = 0;
    this.activeSessionsCount = 1;

    // Dummy enrolled courses
    this.enrolledCourses = user.enrolledCourses?.map((courseId: string) => ({
      id: courseId,
      title: `Course ${courseId}`,
      description: 'Course description goes here',
      progress: Math.floor(Math.random() * 100)
    })) || [];

    // Dummy recent activities
    if (this.enrolledCourses.length > 0) {
      this.hasActivity = true;
      this.recentActivities = [
        {
          type: 'course',
          description: `Started ${this.enrolledCourses[0].title}`,
          timestamp: new Date()
        }
      ];
    }
  }

  getActivityIcon(type: Activity['type']): string {
    switch (type) {
      case 'course':
        return 'fas fa-book';
      case 'quiz':
        return 'fas fa-question-circle';
      default:
        return 'fas fa-info-circle';
    }
  }

  continueCourse(courseId: string) {
    this.router.navigate(['/course', courseId]);
  }

  logout() {
    this.studentAuth.logout().subscribe(() => {
      this.router.navigate(['/account']);
    });
  }
}
