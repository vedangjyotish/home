import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AdminLoginResponse {
  access: string;
  refresh: string;
}

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'admin_token';
  private readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.API_URL}/token/`, { email, password }).pipe(
      tap(response => {
        this.setTokens(response.access, response.refresh);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    const refreshToken = this.getRefreshToken();
    const headers = this.getAuthorizationHeaders();

    // Even if there's no refresh token, we'll still clear local state
    if (!refreshToken) {
      this.handleLogoutSuccess();
      return of({ message: 'Logged out locally' });
    }

    return this.http.post<LogoutResponse>(
      `${this.API_URL}/token/logout/`,
      { refresh_token: refreshToken },
      { headers }
    ).pipe(
      tap(() => this.handleLogoutSuccess()),
      catchError(error => {
        console.error('Logout error:', error);
        // Even if server request fails, clear local state
        this.handleLogoutSuccess();
        return throwError(() => error);
      })
    );
  }

  private handleLogoutSuccess(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
    // Ensure we navigate to the full admin login path
    this.router.navigate(['/admin', 'login']).then(() => {
      console.log('Successfully navigated to login page');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ access: string }>(`${this.API_URL}/token/refresh/`, { refresh: refreshToken }).pipe(
      tap(response => {
        this.setAccessToken(response.access);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.clearTokens();
        this.isAuthenticatedSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  getAuthorizationHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private setAccessToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private clearTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  private getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    // TODO: Add JWT expiration check if needed
    return true;
  }
}
