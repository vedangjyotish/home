import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminAuthService } from '../../services/admin-auth.service';

export interface StudentUser {
  id: number;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive';
  date_joined: string;
}

export interface Student {
  id: number;
  student_id: string;
  user: StudentUser;
  qualification: string;
  contact: string;
  date_of_birth: string;
  blood_group: string;
  medical_conditions: string | null;
  profile_photo: string;
  enrolled_courses_count: number;
  created_at: string;
  updated_at: string;
}

export interface StudentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
}

export interface StudentFilters {
  page?: number;
  page_size?: number;
  status?: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = `${environment.apiUrl}/admin/students/`;

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthorizationHeaders();
  }

  getStudents(filters: StudentFilters = {}): Observable<StudentResponse> {
    let params = new HttpParams();
    
    if (filters.page) {
      params = params.append('page', filters.page.toString());
    }
    if (filters.page_size) {
      params = params.append('page_size', filters.page_size.toString());
    }
    if (filters.status) {
      params = params.append('status', filters.status);
    }

    return this.http.get<StudentResponse>(this.apiUrl, { 
      params,
      headers: this.getHeaders()
    });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders()
    });
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student, {
      headers: this.getHeaders()
    });
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}${id}/`, student, {
      headers: this.getHeaders()
    });
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders()
    });
  }

  updateStatus(studentId: number, status: 'active' | 'inactive'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}${studentId}/status/`, { status }, {
      headers: this.getHeaders()
    });
  }
}
