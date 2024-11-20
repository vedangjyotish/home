import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
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

    constructor(private tokenStorage: TokenStorageService) {
        if (isPlatformBrowser(this.platformId)) {
            // Load cart from localStorage if exists
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.cartItems.set(JSON.parse(savedCart));
            }
        }
    }

    addToCart(item: ICartItem) {
        const currentItems = this.cartItems();
        const updatedItems = [...currentItems, item];
        this.cartItems.set(updatedItems);
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
