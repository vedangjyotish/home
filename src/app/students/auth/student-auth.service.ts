import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { Router } from '@angular/router';

interface StudentUser {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
}

interface LoginResponse {
  message: string;
  student_id: string;
  access_token: string;
  refresh_token: string;
  user: StudentUser;
}

interface LoginRequest {
  identifier: string;  // Email or phone number
  password: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface BackendSignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  contact: string;
}

interface ErrorResponse {
  error: string;
}

interface AuthResponse {
  message: string;
  student_id: string;
  access_token: string;
  refresh_token: string;
  user: StudentUser;
}

interface LogoutResponse {
  status: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient, 
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid credentials or missing fields';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 404) {
        errorMessage = 'No student profile found';
      }
    }
    
    console.error('API error:', error);
    return throwError(() => errorMessage);
  }

  signup(studentData: SignupData): Observable<LoginResponse> {
    const signupUrl = `${this.baseUrl}/auth/student/register/`;
    
    const backendData: BackendSignupData = {
      email: studentData.email,
      password: studentData.password,
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      contact: studentData.phone
    };

    return this.http.post<LoginResponse>(signupUrl, backendData).pipe(
      tap(response => {
        if (response.access_token) {
          this.tokenStorage.saveToken(response.access_token);
          this.tokenStorage.saveRefreshToken(response.refresh_token);
          this.tokenStorage.saveUser({
            id: response.student_id,
            email: response.user.email,
            name: `${response.user.first_name} ${response.user.last_name}`,
            type: 'student',
            contact: response.user.phone_number
          });
        }
      }),
      catchError(this.handleError)
    );
  }

  login(identifier: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${this.baseUrl}/auth/student/login/`;
    const loginData: LoginRequest = {
      identifier,
      password
    };

    return this.http.post<LoginResponse>(loginUrl, loginData).pipe(
      tap(response => {
        if (response.access_token) {
          this.tokenStorage.saveToken(response.access_token);
          this.tokenStorage.saveRefreshToken(response.refresh_token);
          this.tokenStorage.saveUser({
            id: response.student_id,
            email: response.user.email,
            name: `${response.user.first_name} ${response.user.last_name}`,
            type: 'student',
            contact: response.user.phone_number
          });
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    const logoutUrl = `${this.baseUrl}/auth/student/logout/`;
    const accessToken = this.tokenStorage.getToken();
    const refreshToken = this.tokenStorage.getRefreshToken();

    // Only make the logout request if we have both tokens
    if (accessToken && refreshToken) {
      // Create headers with the access token
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${accessToken.trim()}`)
        .set('Content-Type', 'application/json');

      // Include refresh token in the request body with key 'refresh'
      const body = {
        refresh: refreshToken.trim()
      };

      // Make the POST request with both tokens
      this.http.post<LogoutResponse>(logoutUrl, body, { headers }).pipe(
        tap(response => {
          if (response.status === 'success') {
            console.log('Logout successful:', response.message);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Logout error:', error);
          
          let errorMessage = 'An error occurred during logout';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Invalid or expired token';
          } else if (error.status === 400) {
            errorMessage = 'Invalid refresh token';
          }

          // Return an observable with error info
          return of({ status: 'error', message: errorMessage });
        }),
        // Always execute cleanup regardless of success/failure
        finalize(() => {
          this.tokenStorage.signOut();
          this.router.navigate(['/account']);
        })
      ).subscribe();
    } else {
      // If tokens are missing, log which ones and perform local logout
      if (!accessToken) console.log('Access token missing');
      if (!refreshToken) console.log('Refresh token missing');
      console.log('Performing local logout only');
      this.tokenStorage.signOut();
      this.router.navigate(['/account']);
    }
  }

  isLoggedIn(): boolean {
    const token = this.tokenStorage.getToken();
    return !!token;
  }

  getCurrentUser(): any {
    return this.tokenStorage.getUser();
  }
}
