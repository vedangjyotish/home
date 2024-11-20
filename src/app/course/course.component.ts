import { Component, Input, Renderer2, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseService } from '../ccards/courses.service';
import { TokenStorageService } from '../core/services/token-storage.service';
import { CommonModule } from '@angular/common';
import { cdata } from '../ccards/cdata';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  cname = signal('');
  currentCourseId: string = 'c1'; // Set default course ID
  isEnrolled = signal(false);
  
  activeTabIndex = signal(0);
  activeModuleIndex: number = 0;

  private readonly courseData = cdata;

  constructor( 
    private renderer: Renderer2, 
    private coursesService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    // Subscribe to router events to handle scroll position
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // If it's a tab route, maintain scroll position
        if (event.url.includes('/tabs/')) {
          const currentScroll = window.scrollY;
          setTimeout(() => window.scrollTo(0, currentScroll), 0);
        } else {
          // For other routes, scroll to top
          window.scrollTo(0, 0);
        }
      }
    });

    // Get the course ID from the route parameters
    this.route.params.subscribe(params => {
      if (params['cid']) {
        this.currentCourseId = params['cid'];
      }
      this.updateCourseData();
      
      // Navigate to the first tab by default if not already on a tab
      if (!this.router.url.includes('/tabs/')) {
        this.router.navigate(['tabs', 0], { relativeTo: this.route });
      }
    });

    // Handle tab changes
    this.route.firstChild?.url.subscribe(() => {
      const tabIndex = this.route.firstChild?.snapshot.url[1]?.path;
      if (tabIndex) {
        this.activeTabIndex.set(parseInt(tabIndex));
      }
    });
  }

  private updateCourseData() {
    // Try to get course from service first
    const course = this.coursesMap.get(this.currentCourseId);
    if (course) {
      this.cname.set(course.name);
    } else {
      // Fallback to static data if not found in service
      const staticCourse = this.courseData.find(c => c.cid === this.currentCourseId);
      this.cname.set(staticCourse?.name || 'Unknown Course');
    }
    this.checkEnrollmentStatus();
  }

  private coursesMap = new Map(this.coursesService.courses.map(course => [course.cid, course]));
  
  @Input()
  set cid(uid: string | undefined) {
    if (uid) {
      this.currentCourseId = uid;
      this.updateCourseData();
    }
  }

  private checkEnrollmentStatus() {
    const user = this.tokenStorage.getUser();
    if (user && user.enrolledCourses) {
      this.isEnrolled.set(user.enrolledCourses.includes(this.currentCourseId));
    } else {
      this.isEnrolled.set(false);
    }
  }

  showContents(event: Event, element: HTMLElement, index: number) {
    event.preventDefault();
    event.stopPropagation();
    
    this.activeTabIndex.set(index);
    this.updateUnderlinePosition(event, element, index);
  }

  private updateUnderlinePosition(event: Event, element: HTMLElement, index: number) {
    event.preventDefault();
    this.activeTabIndex.set(index);

    const targetLink = event.target as HTMLAnchorElement;
    const offsetWidth = targetLink.offsetWidth;
    const offsetLeft = targetLink.offsetLeft;
    
    this.renderer.setStyle(element, 'width', `${offsetWidth}px`);
    this.renderer.setStyle(element, 'left', `${offsetLeft}px`);
  }

  private scrollTabsToCenter() {
    const moduleSection = document.querySelector('.the_course_module');
    if (moduleSection instanceof HTMLElement) {
      const viewportHeight = window.innerHeight;
      const elementRect = moduleSection.getBoundingClientRect();
      const elementHeight = elementRect.height;
      const scrollOffset = elementRect.top + window.scrollY - (viewportHeight - elementHeight) / 2;
      
      window.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  }

  get rating(): number {
    const course = this.courseData.find(c => c.cid === this.currentCourseId);
    return course?.rating || 5;
  }

  getStarArray(): string[] {
    const rating = this.rating; 
    const starsArray: string[] = [];

    // Add full stars first
    for (let i = 0; i < Math.floor(rating); i++) {
      starsArray.push('full');
    }

    // Add half star if there's a decimal
    if (rating % 1 > 0) {
      starsArray.push('half');
    }

    // Fill the rest with empty stars
    while (starsArray.length < 5) {
      starsArray.push('empty');
    }

    return starsArray;
  }
}
