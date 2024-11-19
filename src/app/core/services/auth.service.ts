import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Student } from '../../students/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentStudentSubject = new BehaviorSubject<Student | null>(null);
  public currentStudent$ = this.currentStudentSubject.asObservable();

  // Dummy credentials for testing
  private readonly DUMMY_CREDENTIALS = {
    email: 'admin',
    password: 'admin'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if there's a stored student session
      const storedStudent = localStorage.getItem('student_data');
      if (storedStudent) {
        this.currentStudentSubject.next(JSON.parse(storedStudent));
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Check against dummy credentials
    const isValidCredentials = email === this.DUMMY_CREDENTIALS.email && 
                             password === this.DUMMY_CREDENTIALS.password;

    return of(isValidCredentials).pipe(
      tap(success => {
        if (success && isPlatformBrowser(this.platformId)) {
          const mockStudent: Student = {
            id: '1',
            name: 'Admin User',
            email: email,
            phoneNumber: '1234567890',
            city: 'New York',
            pinCode: '123456',
            contactNumber: '1234567890',
            dateOfBirth: new Date(),
            alternateContactNumber: undefined,
            profilePicture: undefined
          };
          localStorage.setItem('student_token', 'mock_token');
          localStorage.setItem('student_data', JSON.stringify(mockStudent));
          this.currentStudentSubject.next(mockStudent);
        }
      })
    );
  }

  signup(studentData: Partial<Student>): Observable<boolean> {
    // For testing, always succeed signup but require login afterward
    return of(true).pipe(
      map(() => {
        const newStudent: Student = {
          id: Math.random().toString(36).substr(2, 9),
          name: studentData.name || '',
          email: studentData.email || '',
          phoneNumber: studentData.phoneNumber || '',
          city: studentData.city || '',
          pinCode: studentData.pinCode || '',
          contactNumber: studentData.contactNumber || '',
          dateOfBirth: studentData.dateOfBirth || new Date(),
          alternateContactNumber: studentData.alternateContactNumber,
          profilePicture: studentData.profilePicture
        };
        return true;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_data');
    }
    this.currentStudentSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('student_token') !== null;
    }
    return false;
  }

  getCurrentStudent(): Student | null {
    return this.currentStudentSubject.value;
  }

  updateStudentProfile(studentData: Partial<Student>): Observable<boolean> {
    // TODO: Replace with actual API call
    return of(true).pipe(
      tap(success => {
        if (success && isPlatformBrowser(this.platformId)) {
          const currentStudent = this.getCurrentStudent();
          if (currentStudent) {
            const updatedStudent: Student = {
              ...currentStudent,
              name: studentData.name || currentStudent.name,
              email: studentData.email || currentStudent.email,
              phoneNumber: studentData.phoneNumber || currentStudent.phoneNumber,
              city: studentData.city || currentStudent.city,
              pinCode: studentData.pinCode || currentStudent.pinCode,
              contactNumber: studentData.contactNumber || currentStudent.contactNumber,
              alternateContactNumber: studentData.alternateContactNumber !== undefined ? studentData.alternateContactNumber : currentStudent.alternateContactNumber,
              dateOfBirth: studentData.dateOfBirth || currentStudent.dateOfBirth,
              profilePicture: studentData.profilePicture !== undefined ? studentData.profilePicture : currentStudent.profilePicture
            };
            localStorage.setItem('student_data', JSON.stringify(updatedStudent));
            this.currentStudentSubject.next(updatedStudent);
          }
        }
      })
    );
  }
}
