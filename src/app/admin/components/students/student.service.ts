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
  qualification: string | null;
  contact: string;
  date_of_birth: string | null;
  blood_group: string | null;
  medical_conditions: string | null;
  profile_photo: string | null;
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

// Interface for student creation
export interface CreateStudentRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  contact?: string;
  qualification?: string;
  date_of_birth?: string;
  blood_group?: string;
  medical_conditions?: string | null;
  profile_photo?: string | undefined;
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

  getStudents(filters: StudentFilters = {}): Observable<StudentResponse | Student[]> {
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

    return this.http.get<StudentResponse | Student[]>(this.apiUrl, { 
      params,
      headers: this.getHeaders()
    });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders()
    });
  }

  createStudent(studentData: CreateStudentRequest): Observable<Student> {
    const formattedData: CreateStudentRequest = { ...studentData };

    if (formattedData.phone_number) {
      if (!formattedData.phone_number.startsWith('+')) {
        if (formattedData.phone_number.length === 10) {
          formattedData.phone_number = `+91${formattedData.phone_number}`;
        }
      }
    }

    if (formattedData.profile_photo) {
      const formData = new FormData();
      
      if (typeof formattedData.profile_photo === 'string' && formattedData.profile_photo.startsWith('data:')) {
        const base64Data = formattedData.profile_photo.split(',')[1];
        const blob = this.base64ToBlob(base64Data, 'image/jpeg');
        formData.append('profile_photo', blob, 'profile.jpg');
      }

      (Object.keys(formattedData) as Array<keyof CreateStudentRequest>).forEach(key => {
        const value = formattedData[key];
        if (key !== 'profile_photo' && value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      return this.http.post<Student>(this.apiUrl, formData, {
        headers: new HttpHeaders({
          'Authorization': this.getHeaders().get('Authorization') || ''
        })
      });
    }

    return this.http.post<Student>(this.apiUrl, formattedData, {
      headers: this.getHeaders()
    });
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
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

  updateStatus(studentId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}${studentId}/status/`, 
      { status },
      { headers: this.getHeaders() }
    );
  }
}
