import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Example methods - modify according to your API endpoints
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }
}
