import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ICartItem, IPaymentDetails } from '../interfaces/cart.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems = this.cartService.getCartItems();
  showPaymentForm = signal(false);
  paymentDetails: IPaymentDetails = {
    name: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    transactionId: '',
    paymentStatus: 'pending',
    amount: 0
  };

  totalAmount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.price, 0);
  });

  whatsappNumber = this.cartService.getWhatsAppNumber();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  removeItem(courseId: string) {
    this.cartService.removeFromCart(courseId);
  }

  updateModuleSelection(item: ICartItem, moduleIndex: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      item.selectedModules = [...item.selectedModules, moduleIndex];
    } else {
      item.selectedModules = item.selectedModules.filter(i => i !== moduleIndex);
    }
    
    // Update price based on selected modules
    if (item.selectedModules.length === 0) {
      this.removeItem(item.courseId);
    } else {
      item.price = this.cartService.calculateModulePrice(
        parseInt(item.price.toString()),
        item.selectedModules.length,
        item.selectedModules.length
      );
    }
  }

  proceedToPayment() {
    this.showPaymentForm.set(true);
  }

  submitPayment() {
    this.paymentDetails.amount = this.totalAmount();
    
    this.cartService.submitEnrollment(this.paymentDetails).subscribe({
      next: (enrollment) => {
        // Clear cart after successful enrollment
        this.cartService.clearCart();
        
        // Show success message and WhatsApp instructions
        alert(`Enrollment submitted! Please send your payment proof to WhatsApp number: ${this.whatsappNumber}`);
        
        // Redirect to courses page
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Enrollment failed:', error);
        alert('Enrollment failed. Please try again or contact support.');
      }
    });
  }

  getModuleArray(totalModules: number): number[] {
    return Array.from({ length: totalModules }, (_, i) => i);
  }
}
