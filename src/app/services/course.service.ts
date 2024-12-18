import { Injectable } from '@angular/core';
import { ICourse } from '../interfaces/course.interface';
import { cdata } from '../ccards/cdata';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly courseData = cdata;

  constructor() {}

  // Get all courses
  getAllCourses(): Observable<ICourse[]> {
    return of(this.courseData);
  }

  // Get course by ID
  getCourseById(cid: string): Observable<ICourse | undefined> {
    const course = this.courseData.find(course => course.cid === cid);
    return of(course);
  }

  // Get featured courses
  getFeaturedCourses(): Observable<ICourse[]> {
    return of(this.courseData.filter(course => course.featured));
  }
}
