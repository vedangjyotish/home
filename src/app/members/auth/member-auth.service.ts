import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MemberAuthService {
  private apiUrl = `${environment.apiUrl}/members/auth`;

  // Dummy credentials for testing
  private readonly DUMMY_MEMBER = {
    phone: '9876543210',
    password: 'password123',
    name: 'Test Member',
    type: 'member'
  };

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  login(credentials: { phone: string; password: string }): Observable<any> {
    // Simulate API call
    if (credentials.phone === this.DUMMY_MEMBER.phone && credentials.password === this.DUMMY_MEMBER.password) {
      const response = {
        token: 'dummy-member-token-' + Date.now(),
        user: {
          name: this.DUMMY_MEMBER.name,
          phone: this.DUMMY_MEMBER.phone,
          type: this.DUMMY_MEMBER.type
        }
      };

      // Store the token and user data
      this.tokenStorage.saveToken(response.token);
      this.tokenStorage.saveUser(response.user);

      return of(response).pipe(delay(500)); // Simulate network delay
    }

    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  signup(memberData: {
    name: string;
    phone: string;
    password: string;
    specialization?: string;
    experience?: number;
  }): Observable<any> {
    // Simulate API call
    const response = {
      token: 'dummy-member-token-' + Date.now(),
      user: {
        name: memberData.name,
        phone: memberData.phone,
        type: 'member'
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

  forgotPassword(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { phone });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }

  verifyPhone(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-phone`, { token });
  }
}
