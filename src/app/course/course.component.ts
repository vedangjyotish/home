import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../core/services/token-storage.service';
import { CommonModule } from '@angular/common';
import { CourseService } from '../services/course.service';
import { ICourse } from '../interfaces/course.interface';
import { CartService } from '../services/cart.service'; 
import { ICartItem } from '../interfaces/cart.interface'; 

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseData = signal<ICourse | null>(null);
  activeTabIndex = signal(0);
  isEnrolled = signal(false);
  selectedModules: { [key: number]: boolean } = {};

  // Computed values
  cname = computed(() => this.courseData()?.name ?? '');
  rating = computed(() => this.courseData()?.rating ?? 0);
  mods = computed(() => this.courseData()?.mods ?? []);
  image = computed(() => this.courseData()?.img ? `../../assets/ccards/img/${this.courseData()?.img}` : '');
  price = computed(() => this.courseData()?.price ?? '');
  taglines = computed(() => this.courseData()?.tagline ?? []);
  highlights = computed(() => this.courseData()?.highlights ?? []);

  constructor(
    private courseService: CourseService,
    private cartService: CartService, 
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) {
    this.route.params.subscribe(params => {
      const cid = params['cid'];
      if (cid) {
        this.loadCourseData(cid);
      }
    });
  }

  ngOnInit() {
    // Load course data when route params change
    this.route.params.subscribe(params => {
      const cid = params['cid'];
      if (cid) {
        this.loadCourseData(cid);
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

  private loadCourseData(cid: string) {
    console.log('Loading course data for:', cid);
    this.courseService.getCourseById(cid).subscribe({
      next: (course) => {
        console.log('Received course data:', course);
        if (course) {
          this.courseData.set(course);
          this.checkEnrollmentStatus(cid);
          this.isEnrolled.set(this.cartService.isEnrolled(cid));
          // Initialize all modules as selected by default
          if (course.mods) {
            course.mods.forEach((mod: any, index: number) => {
              this.selectedModules[index] = true;
            });
          }
          // Navigate to first tab if not already on a tab
          if (!this.router.url.includes('/tabs/')) {
            this.router.navigate(['tabs', 0], { relativeTo: this.route });
          }
        } else {
          console.error('Course not found:', cid);
          this.router.navigate(['/courses']);
        }
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.router.navigate(['/courses']);
      }
    });
  }

  private checkEnrollmentStatus(cid: string) {
    const user = this.tokenStorage.getUser();
    if (user && user.enrolledCourses) {
      this.isEnrolled.set(user.enrolledCourses.includes(cid));
    } else {
      this.isEnrolled.set(false);
    }
  }

  getStarArray(): ('full' | 'half' | 'empty')[] {
    const rating = this.rating();
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  showContents(event: Event, element: HTMLElement, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.activeTabIndex.set(index);
    this.updateUnderlinePosition(element, index);
  }

  private updateUnderlinePosition(element: HTMLElement, index: number) {
    const tabsContainer = element.parentElement;
    if (tabsContainer) {
      const activeTab = tabsContainer.children[index] as HTMLElement;
      if (activeTab) {
        const offsetWidth = activeTab.offsetWidth;
        const offsetLeft = activeTab.offsetLeft;
        element.style.width = `${offsetWidth}px`;
        element.style.left = `${offsetLeft}px`;
      }
    }
  }

  addToCart() {
    try {
      const course = this.courseData();
      if (!course) return;

      // Convert selectedModules object to array of selected module indices
      const selectedModulesArray = Object.entries(this.selectedModules)
        .filter(([_, isSelected]) => isSelected)
        .map(([index]) => parseInt(index));

      const cartItem: ICartItem = {
        courseId: course.cid,
        courseName: course.name,
        courseImage: course.img,
        selectedModules: selectedModulesArray,
        totalModules: course.mods?.length || 0,
        price: parseInt(course.price.replace(/,/g, '')),
        isFullCourse: selectedModulesArray.length === (course.mods?.length || 0)
      };
      
      this.cartService.addToCart(cartItem);
      this.router.navigate(['/cart']);
    } catch (error: any) {
      alert(error.message);
    }
  }

  enrollNow() {
    try {
      const course = this.courseData();
      if (!course) return;

      // Convert selectedModules object to array of selected module indices
      const selectedModulesArray = Object.entries(this.selectedModules)
        .filter(([_, isSelected]) => isSelected)
        .map(([index]) => parseInt(index));

      const cartItem: ICartItem = {
        courseId: course.cid,
        courseName: course.name,
        courseImage: course.img,
        selectedModules: selectedModulesArray,
        totalModules: course.mods?.length || 0,
        price: parseInt(course.price.replace(/,/g, '')),
        isFullCourse: selectedModulesArray.length === (course.mods?.length || 0)
      };
      
      this.cartService.addToCart(cartItem);
      this.router.navigate(['/cart']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
