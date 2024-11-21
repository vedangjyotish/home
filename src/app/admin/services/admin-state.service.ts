import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  [key: string]: any;
}

interface AdminState {
  isLoading: boolean;
  currentUser: AdminUser | null;
  notifications: any[];
  error: string | null;
  stats: AdminStats | null;
  users: AdminUser[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Define initial state
  private state = signal<AdminState>({
    isLoading: false,
    currentUser: null,
    notifications: [],
    error: null,
    stats: null,
    users: []
  });

  // Expose read-only signals for components
  readonly isLoading = computed(() => this.state().isLoading);
  readonly currentUser = computed(() => this.state().currentUser);
  readonly notifications = computed(() => this.state().notifications);
  readonly error = computed(() => this.state().error);
  readonly stats = computed(() => this.state().stats);
  readonly users = computed(() => this.state().users);

  // State update methods
  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, isLoading: loading }));
  }

  setCurrentUser(user: AdminUser | null) {
    this.state.update(state => ({ ...state, currentUser: user }));
  }

  addNotification(notification: any) {
    this.state.update(state => ({
      ...state,
      notifications: [...state.notifications, notification]
    }));
  }

  clearNotifications() {
    this.state.update(state => ({ ...state, notifications: [] }));
  }

  setError(error: string | null) {
    this.state.update(state => ({ ...state, error }));
  }

  // API methods with automatic state updates
  getStats(): Observable<AdminStats> {
    this.setLoading(true);
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`).pipe(
      tap(stats => {
        this.state.update(state => ({ ...state, stats }));
      }),
      tap(() => this.setLoading(false))
    );
  }

  getUsers(): Observable<AdminUser[]> {
    this.setLoading(true);
    return this.http.get<AdminUser[]>(`${this.apiUrl}/admin/users`).pipe(
      tap(users => {
        this.state.update(state => ({ ...state, users }));
      }),
      tap(() => this.setLoading(false))
    );
  }

  updateUser(userId: string, userData: Partial<AdminUser>): Observable<AdminUser> {
    this.setLoading(true);
    return this.http.put<AdminUser>(`${this.apiUrl}/admin/users/${userId}`, userData).pipe(
      tap(updatedUser => {
        this.state.update(state => ({
          ...state,
          users: state.users.map(user => 
            user.id === userId ? updatedUser : user
          )
        }));
      }),
      tap(() => this.setLoading(false))
    );
  }

  deleteUser(userId: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`).pipe(
      tap(() => {
        this.state.update(state => ({
          ...state,
          users: state.users.filter(user => user.id !== userId)
        }));
      }),
      tap(() => this.setLoading(false))
    );
  }
}
