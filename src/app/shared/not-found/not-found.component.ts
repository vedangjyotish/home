import { Component, effect, signal, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [], 
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  countdown = signal(9);
  private timer: ReturnType<typeof setInterval> | undefined;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  
  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        if (this.countdown() === 0) {
          this.goToHome();
        }
      });

      // Start countdown only in browser
      this.timer = setInterval(() => {
        if (this.countdown() > 0) {
          this.countdown.update(val => val - 1);
        } else {
          this.clearTimer();
        }
      }, 1000);

      // Cleanup on component destroy
      this.destroyRef.onDestroy(() => {
        this.clearTimer();
      });
    }
  }

  goToHome(): void {
    this.clearTimer();
    this.router.navigate(['/']);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
