import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { PaymentService, PaymentSubmission } from '../services/payment.service';
import { AuthService } from '../core/services/auth.service';
import { ICartItem } from '../interfaces/cart.interface';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-payment-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-upload.component.html',
  styleUrls: ['./payment-upload.component.css']
})
export class PaymentUploadComponent {
  transactionId: string = '';
  paymentScreenshot: File | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.paymentScreenshot = file;
    }
  }

  async submitPayment() {
    if (!this.transactionId || !this.paymentScreenshot) {
      this.errorMessage = 'Please provide both transaction ID and payment screenshot';
      return;
    }

    const currentStudent = this.authService.getCurrentStudent();
    if (!currentStudent || !currentStudent.id) {
      this.errorMessage = 'User session is invalid. Please log in again.';
      this.router.navigate(['/auth/login']);
      return;
    }

    const cartItems = this.cartService.getCartItems();
    const totalAmount = this.cartService.totalAmount;

    if (cartItems().length === 0) {
      this.errorMessage = 'Your cart is empty. Please add courses before proceeding.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const cartItems = this.cartService.getCartItems();
      const paymentData: PaymentSubmission = {
        transactionId: this.transactionId,
        screenshot: this.paymentScreenshot,
        courseIds: cartItems().map((item: ICartItem) => item.courseId),
        selectedModules: cartItems().flatMap((item: ICartItem) => item.selectedModules.map(String)),
        studentId: currentStudent.id,
        totalAmount: totalAmount()
      };

      console.log('Payment Data being sent to server:');
      console.dir(paymentData, { depth: null });

      await this.paymentService.submitPayment(paymentData)
        .pipe(
          catchError(error => {
            console.error('Payment submission error:', error);
            if (error.status === 0) {
              this.errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.error?.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Payment submission failed. Please try again or contact support.';
            }
            return of(null);
          }),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .toPromise();

      if (!this.errorMessage) {
        // Only clear cart and navigate on success
        this.cartService.clearCart();
        this.router.navigate(['/enrollment-success']);
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      this.errorMessage = 'An unexpected error occurred. Please try again or contact support.';
      this.isSubmitting = false;
    }
  }
}
