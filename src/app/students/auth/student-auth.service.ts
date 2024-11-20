import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: {
    name: string;
    id: string;
    type: string;
    enrolledCourses: string[];
  };
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

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
    type: 'student',
    enrolledCourses: ['c1']  // Adding enrolled courses array with c1
  };

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  signup(studentData: SignupData): Observable<AuthResponse> {
    // For demo purposes, create a response similar to login
    const response: AuthResponse = {
      token: 'dummy-student-token-' + Date.now(),
      user: {
        name: studentData.name,
        id: studentData.email,
        type: 'student',
        enrolledCourses: []
      }
    };

    return of(response).pipe(
      delay(500), // Simulate network delay
      tap(res => {
        this.tokenStorage.saveToken(res.token);
        this.tokenStorage.saveUser(res.user);
      }),
      catchError(error => throwError(() => new Error('Signup failed')))
    );

    // In a real application, you would use this:
    // return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, studentData).pipe(
    //   tap(res => {
    //     this.tokenStorage.saveToken(res.token);
    //     this.tokenStorage.saveUser(res.user);
    //   }),
    //   catchError(error => throwError(() => new Error('Signup failed')))
    // );
  }

  login(credentials: { id: string; password: string }): Observable<AuthResponse> {
    // Simulate API call
    if (credentials.id === this.DUMMY_STUDENT.id && credentials.password === this.DUMMY_STUDENT.password) {
      const response: AuthResponse = {
        token: 'dummy-student-token-' + Date.now(),
        user: {
          name: this.DUMMY_STUDENT.name,
          id: this.DUMMY_STUDENT.id,
          type: this.DUMMY_STUDENT.type,
          enrolledCourses: this.DUMMY_STUDENT.enrolledCourses
        }
      };

      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(res => {
          // Store the token and user data
          this.tokenStorage.saveToken(res.token);
          this.tokenStorage.saveUser(res.user);
        })
      );
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      delay(500), // Simulate network delay
      tap(res => {
        this.tokenStorage.saveToken(res.token);
        this.tokenStorage.saveUser(res.user);
      }),
      catchError((error) => {
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  logout(): Observable<void> {
    // In a real application, you might want to make an API call to invalidate the token
    return new Observable<void>(observer => {
      setTimeout(() => {
        this.tokenStorage.signOut();
        this.router.navigate(['/']);
        observer.next();
        observer.complete();
      }, 200); // Simulate network delay
    });
  }

  isLoggedIn(): boolean {
    const token = this.tokenStorage.getToken();
    const user = this.tokenStorage.getUser();
    return !!(token && user && user.type === 'student');
  }

  getCurrentUser(): any {
    return this.tokenStorage.getUser();
  }
}
