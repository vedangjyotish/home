import { DecimalPipe, CommonModule, NgIf } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { ICartItem } from "../../interfaces/cart.interface";
import { TokenStorageService } from "../../core/services/token-storage.service";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DecimalPipe, RouterLink, CommonModule, NgIf],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent {
  @Input({required: true }) cid!: string;
  @Input({required: true}) name!: string;
  @Input() alt!: string;
  @Input({required: true}) img!: string;
  @Input({required: true}) rating!: number;
  @Input({required: true}) highlights!: any[];
  @Input({required: true}) taglines!: any[];
  @Input({required: true}) price!: string;
  @Input({required: true}) modules!: any[];
  @Output() select = new EventEmitter();

  showModal = false;
  modalMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  get imagePath() {
    return 'assets/ccards/img/' + this.img;
  }

  get isEnrolled(): boolean {
    const user = this.tokenStorage.getUser();
    return user?.enrolledCourses?.includes(this.cid) || false;
  }

  get isInCart(): boolean {
    return this.cartService.isInCart(this.cid);
  }

  enrollNow() {
    try {
      // If course is already in cart, show modal and return
      if (this.isInCart) {
        this.showModal = true;
        this.modalMessage = 'This course is already in your cart';
        return;
      }

      // If course is not in cart, add it and navigate directly
      const cartItem: ICartItem = {
        courseId: this.cid,
        courseName: this.name,
        courseImage: this.img,
        selectedModules: Array.from({ length: this.modules.length }, (_, i) => i),
        totalModules: this.modules.length,
        price: parseInt(this.price.replace(/,/g, '')),
        isFullCourse: true
      };
      
      this.cartService.addToCart(cartItem);
      window.scrollTo(0, 0);
      this.router.navigate(['/cart']);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      this.showModal = true;
      this.modalMessage = error.message || 'Error adding course to cart';
      setTimeout(() => this.showModal = false, 3000);
    }
  }

  onSelectCard() {
    this.select.emit(this.cid);
  }

  closeModal() {
    this.showModal = false;
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
