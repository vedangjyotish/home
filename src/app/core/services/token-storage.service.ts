import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'auth-refresh-token';
  private readonly USER_KEY = 'auth-user';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  signOut(): void {
    if (this.isBrowser) {
      window.sessionStorage.clear();
    }
  }

  public saveToken(token: string): void {
    if (this.isBrowser) {
      window.sessionStorage.removeItem(this.TOKEN_KEY);
      window.sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if (this.isBrowser) {
      return window.sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  public saveRefreshToken(token: string): void {
    if (this.isBrowser) {
      window.sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      window.sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  public getRefreshToken(): string | null {
    if (this.isBrowser) {
      return window.sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  public saveUser(user: any): void {
    if (this.isBrowser) {
      window.sessionStorage.removeItem(this.USER_KEY);
      window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (this.isBrowser) {
      const user = window.sessionStorage.getItem(this.USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  public getUserType(): 'student' | 'member' | null {
    const user = this.getUser();
    return user?.type || null;
  }
}
