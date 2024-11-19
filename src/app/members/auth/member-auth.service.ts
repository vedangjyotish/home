import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberAuthService {
  private apiUrl = `${environment.apiUrl}/members/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { phone: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  signup(memberData: {
    name: string;
    phone: string;
    password: string;
    specialization?: string;
    experience?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, memberData);
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
