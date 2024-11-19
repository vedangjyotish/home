import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  private apiUrl = `${environment.apiUrl}/students/auth`;

  // Dummy credentials for testing
  private readonly DUMMY_STUDENT = {
    id: 'student@test.com',
    password: 'password123',
    name: 'Test Student',
    type: 'student'
  };

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  login(credentials: { id: string; password: string }): Observable<any> {
    // Simulate API call
    if (credentials.id === this.DUMMY_STUDENT.id && credentials.password === this.DUMMY_STUDENT.password) {
      const response = {
        token: 'dummy-student-token-' + Date.now(),
        user: {
          name: this.DUMMY_STUDENT.name,
          id: this.DUMMY_STUDENT.id,
          type: this.DUMMY_STUDENT.type
        }
      };

      // Store the token and user data
      this.tokenStorage.saveToken(response.token);
      this.tokenStorage.saveUser(response.user);

      return of(response).pipe(delay(500)); // Simulate network delay
    }

    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      delay(500), // Simulate network delay
      catchError((error) => {
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  signup(studentData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<any> {
    // Simulate API call
    const response = {
      token: 'dummy-student-token-' + Date.now(),
      user: {
        name: studentData.name,
        id: studentData.email || studentData.phone,
        type: 'student'
      }
    };

    // Store the token and user data
    this.tokenStorage.saveToken(response.token);
    this.tokenStorage.saveUser(response.user);

    return of(response).pipe(delay(500)); // Simulate network delay
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { token });
  }
}
