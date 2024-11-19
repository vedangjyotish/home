import { Component, OnInit, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private routerSubscription: Subscription;
  
  imageUrl: string = '../../assets/appointment/girl.png';
  textAreaRows: number = 8;
  textAreaCols: number = 31;
  selectedService: string = '';
  services: string[] = [
    'Marriage Problems',
    'Career Problems',
    'Business Problems',
    'Health Problems',
    'Vastu Dosh',
    'Name & Mobile Number Correction'
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Subscribe to router events
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.scrollToTop();
      }
    });
  }

  private scrollToTop() {
    // Scroll all possible elements
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // Add a delayed scroll for dynamic content
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }, 100);
  }

  ngOnInit() {
    // Force initial scroll with a slight delay
    if (isPlatformBrowser(this.platformId)) {
      this.scrollToTop();
    }

    // Handle responsive image
    this.breakpointObserver.observe([
      '(max-width: 1440px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.imageUrl = '../../assets/appointment/girl_med.png';
        this.textAreaRows = 4;
      }
    });

    // Get selected service from query params
    this.route.queryParams.subscribe(params => {
      if (params['service']) {
        this.selectedService = params['service'];
        // Scroll again after setting service
        if (isPlatformBrowser(this.platformId)) {
          this.scrollToTop();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
