import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentSubmission {
  transactionId: string;
  screenshot: File;
  courseIds: string[];
  studentId: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  submitPayment(paymentData: PaymentSubmission): Observable<any> {
    const formData = new FormData();
    formData.append('transactionId', paymentData.transactionId);
    formData.append('screenshot', paymentData.screenshot);
    formData.append('courseIds', JSON.stringify(paymentData.courseIds));
    formData.append('studentId', paymentData.studentId);
    formData.append('totalAmount', paymentData.totalAmount.toString());

    return this.http.post(`${this.apiUrl}/submit`, formData);
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${paymentId}`);
  }
}
