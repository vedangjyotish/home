import { Injectable, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { ICartItem, IPaymentDetails, IEnrollment } from '../interfaces/cart.interface';
import { TokenStorageService } from '../core/services/token-storage.service';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = signal<ICartItem[]>([]);
    private readonly WHATSAPP_NUMBER = '+91 1234567890'; // Replace with actual number
    private platformId = inject(PLATFORM_ID);

    totalAmount = computed(() => {
        return this.cartItems().reduce((total, item) => total + item.price, 0);
    });

    constructor(private tokenStorage: TokenStorageService) {
        if (isPlatformBrowser(this.platformId)) {
            // Load cart from localStorage if exists
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.cartItems.set(JSON.parse(savedCart));
            }
        }
    }

    isEnrolled(courseId: string): boolean {
        const user = this.tokenStorage.getUser();
        if (user && user.enrolledCourses) {
            return user.enrolledCourses.includes(courseId);
        }
        return false;
    }

    isInCart(courseId: string): boolean {
        const currentItems = this.cartItems();
        return currentItems.some(item => item.courseId === courseId);
    }

    addToCart(item: ICartItem) {
        // Check if user is already enrolled
        if (this.isEnrolled(item.courseId)) {
            throw new Error('You are already enrolled in this course');
        }

        // Check if item is already in cart
        if (this.isInCart(item.courseId)) {
            throw new Error('This course is already in your cart');
        }

        const updatedItems = [...this.cartItems(), item];
        this.cartItems.set(updatedItems);
        this.saveCartToStorage();
    }

    updateCart(items: ICartItem[]) {
        this.cartItems.set(items);
        this.saveCartToStorage();
    }

    removeFromCart(courseId: string) {
        const currentItems = this.cartItems();
        const updatedItems = currentItems.filter(item => item.courseId !== courseId);
        this.cartItems.set(updatedItems);
        this.saveCartToStorage();
    }

    getCartItems() {
        return this.cartItems;
    }

    clearCart() {
        this.cartItems.set([]);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('cart');
        }
    }

    getWhatsAppNumber() {
        return this.WHATSAPP_NUMBER;
    }

    private saveCartToStorage() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart', JSON.stringify(this.cartItems()));
        }
    }

    // Mock enrollment process - replace with actual API calls later
    submitEnrollment(paymentDetails: IPaymentDetails): Observable<IEnrollment> {
        const user = this.tokenStorage.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const cartItem = this.cartItems()[0]; // Assuming single course enrollment for now
        
        const enrollment: IEnrollment = {
            userId: user.id,
            courseId: cartItem.courseId,
            enrollmentDate: new Date(),
            paymentDetails: {
                ...paymentDetails,
                paymentStatus: 'pending',
                paymentDate: new Date(),
                amount: cartItem.price
            },
            selectedModules: cartItem.selectedModules,
            status: 'pending'
        };

        // TODO: Replace with actual API call
        return of(enrollment);
    }

    calculateModulePrice(fullPrice: number, totalModules: number, selectedModules: number): number {
        return Math.round((fullPrice / totalModules) * selectedModules);
    }
}
