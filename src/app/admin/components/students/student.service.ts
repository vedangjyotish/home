import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive';
  courses: {
    courseId: number;
    courseName: string;
    modules: {
      moduleId: number;
      moduleName: string;
      status: 'active' | 'completed' | 'not-started';
    }[];
  }[];
}

export interface StudentFilters {
  search?: string;
  status?: string;
  courseId?: number;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(filters: StudentFilters = {}): Observable<{ data: Student[]; total: number }> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<{ data: Student[]; total: number }>(this.apiUrl, { params });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Course allocation
  allocateCourse(studentId: number, courseId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${studentId}/courses/${courseId}`, {});
  }

  // Module allocation
  allocateModules(studentId: number, courseId: number, moduleIds: number[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${studentId}/courses/${courseId}/modules`,
      { moduleIds }
    );
  }

  // Update student status
  updateStatus(studentId: number, status: 'active' | 'inactive'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${studentId}/status`, { status });
  }
}
