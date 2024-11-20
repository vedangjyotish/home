import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CourseService } from '../services/course.service';
import { ICartItem, IPaymentDetails } from '../interfaces/cart.interface';
import { ICourse } from '../interfaces/course.interface';
import { Router, RouterLink } from '@angular/router';
import { cdata } from '../ccards/cdata';
import { TokenStorageService } from '../core/services/token-storage.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems = this.cartService.getCartItems();
  courses = signal<{ [key: string]: ICourse }>({});
  showPaymentForm = signal(false);
  suggestedCourse = signal<typeof cdata[0] | null>(null);
  isAnimating = signal(false);
  studentName = signal<string>('');

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
    return this.cartItems().reduce((total, item) => {
      const selectedModulePrices = item.selectedModules.map(moduleIndex => {
        const course = this.courses()[item.courseId];
        if (course && course.mods[moduleIndex] && course.mods[moduleIndex].m_price) {
          return parseInt(course.mods[moduleIndex].m_price.replace(/,/g, ''));
        }
        return 0;
      });
      return total + selectedModulePrices.reduce((sum, price) => sum + price, 0);
    }, 0);
  });

  whatsappNumber = this.cartService.getWhatsAppNumber();

  constructor(
    private cartService: CartService,
    private courseService: CourseService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private authService: AuthService
  ) {
    const user = this.tokenStorage.getUser();
    if (user && user.name) {
      // Capitalize first letter of each word
      const formattedName = user.name.split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      this.studentName.set(formattedName);
    }
    
    // Load course details for cart items
    this.loadCourseDetails();
  }

  private loadCourseDetails() {
    this.cartItems().forEach(item => {
      this.courseService.getCourseById(item.courseId).subscribe(course => {
        if (course) {
          this.courses.update(courses => ({
            ...courses,
            [course.cid]: course
          }));
        }
      });
    });
  }

  getModulePrice(courseId: string, moduleIndex: number): string {
    const course = this.courses()[courseId];
    if (course && course.mods[moduleIndex] && course.mods[moduleIndex].m_price) {
      return course.mods[moduleIndex].m_price;
    }
    return '0';
  }

  getModuleList(courseId: string, moduleIndex: number): string[] {
    const course = this.courses()[courseId];
    if (course && course.mods[moduleIndex]) {
      return course.mods[moduleIndex].list;
    }
    return [];
  }

  removeItem(courseId: string) {
    this.cartService.removeFromCart(courseId);
    if (this.cartItems().length === 0) {
      this.startSuggestionAnimation();
    }
  }

  updateModuleSelection(item: ICartItem, moduleIndex: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedItems = this.cartItems().map(cartItem => {
      if (cartItem.courseId === item.courseId) {
        return {
          ...cartItem,
          selectedModules: isChecked 
            ? [...cartItem.selectedModules, moduleIndex]
            : cartItem.selectedModules.filter(i => i !== moduleIndex)
        };
      }
      return cartItem;
    });
    
    // Find the updated item to check if all modules are deselected
    const updatedItem = updatedItems.find(i => i.courseId === item.courseId);
    if (updatedItem && updatedItem.selectedModules.length === 0) {
      this.removeItem(item.courseId);
    } else {
      // Update the cart service with the new items
      this.cartService.updateCart(updatedItems);
    }
  }

  getModuleArray(courseId: string): number[] {
    const course = this.courses()[courseId];
    return course ? Array.from({ length: course.mods.length }, (_, i) => i) : [];
  }

  startSuggestionAnimation() {
    this.isAnimating.set(true);
    let count = 0;
    const animationInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * cdata.length);
      this.suggestedCourse.set(cdata[randomIndex]);
      count++;
      
      if (count >= 10) { // Stop after 10 iterations
        clearInterval(animationInterval);
        this.isAnimating.set(false);
      }
    }, 200); // Change course every 200ms
  }

  proceedToPayment() {
    this.showPaymentForm.set(true);
  }

  goToCourse(courseId: string) {
    this.router.navigate(['/course', courseId]);
  }

  submitPayment() {
    this.paymentDetails.amount = this.totalAmount();
    
    this.cartService.submitEnrollment(this.paymentDetails).subscribe({
      next: (enrollment) => {
        this.cartService.clearCart();
        alert(`Enrollment submitted! Please send your payment proof to WhatsApp number: ${this.whatsappNumber}`);
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Enrollment failed:', error);
        alert('Enrollment failed. Please try again or contact support.');
      }
    });
  }

  completeEnrollment() {
    if (!this.authService.isLoggedIn()) {
      // Store current cart state or course ID in session storage for redirect after login
      sessionStorage.setItem('enrollmentRedirect', 'true');
      this.router.navigate(['/auth/login']);
      return;
    }

    // If logged in, navigate to payment upload page
    this.router.navigate(['/payment-upload']);
  }
}
