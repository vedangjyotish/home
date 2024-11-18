import { Injectable, signal, computed } from '@angular/core';

interface AdminState {
  isLoading: boolean;
  currentUser: any;
  notifications: any[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
  // Define initial state
  private state = signal<AdminState>({
    isLoading: false,
    currentUser: null,
    notifications: [],
    error: null
  });

  // Expose read-only signals for components
  readonly isLoading = computed(() => this.state().isLoading);
  readonly currentUser = computed(() => this.state().currentUser);
  readonly notifications = computed(() => this.state().notifications);
  readonly error = computed(() => this.state().error);

  // State update methods
  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, isLoading: loading }));
  }

  setCurrentUser(user: any) {
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
}
