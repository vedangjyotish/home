import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scards',
  standalone: true,
  imports: [],
  templateUrl: './scards.component.html',
  styleUrls: ['./scards.component.css']
})
export class ScardsComponent {
  constructor(private router: Router) {}

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

  onBookAppointment(service: string) {
    // Navigate to appointment page with service parameter
    this.router.navigate(['/appointment'], {
      queryParams: { service }
    }).then(() => {
      this.scrollToTop();
    });
  }
}
