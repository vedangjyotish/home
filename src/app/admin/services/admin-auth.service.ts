import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, timer } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

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
  private readonly REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Start token refresh timer if we have a valid token
    if (this.hasValidToken()) {
      this.setupTokenRefreshTimer();
    }
  }

  login(email: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.API_URL}/token/`, { email, password }).pipe(
      tap(response => {
        this.setTokens(response.access, response.refresh);
        this.isAuthenticatedSubject.next(true);
        this.setupTokenRefreshTimer();
      }),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'Invalid credentials. Please check your email and password.';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please try again later.';
        }
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    const refreshToken = this.getRefreshToken();
    const headers = this.getAuthorizationHeaders();

    this.clearTokenRefreshTimer();

    // Even if there's no refresh token, we'll still clear local state
    if (!refreshToken) {
      this.handleLogoutSuccess();
      return of({ message: 'Logged out locally' });
    }

    return this.http.post<LogoutResponse>(
      `${this.API_URL}/token/logout/`,
      { refresh: refreshToken },
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
    this.clearTokenRefreshTimer();
    this.router.navigate(['/admin', 'login']);
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
        this.setupTokenRefreshTimer();
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.clearTokens();
        this.isAuthenticatedSubject.next(false);
        this.clearTokenRefreshTimer();
        return throwError(() => error);
      })
    );
  }

  getAuthorizationHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
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

  private getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  private setupTokenRefreshTimer(): void {
    this.clearTokenRefreshTimer();
    
    const token = this.getAccessToken();
    if (!token) return;

    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const timeUntilExpiry = expirationTime - Date.now();
      const refreshTime = timeUntilExpiry - (this.REFRESH_THRESHOLD * 1000);

      if (refreshTime > 0) {
        this.tokenRefreshTimer = setTimeout(() => {
          this.refreshToken().subscribe();
        }, refreshTime);
      } else {
        // Token is close to expiring or already expired, refresh immediately
        this.refreshToken().subscribe();
      }
    } catch (error) {
      console.error('Error setting up token refresh timer:', error);
    }
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }
}
