import { Component, Input, Renderer2, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseService } from '../ccards/courses.service';
import { TokenStorageService } from '../core/services/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  cname = signal('');
  currentCourseId: string = '';
  isEnrolled = signal(false);
  
  activeTabIndex = signal(0);
  activeModuleIndex: number = 0;

  constructor( 
    private renderer: Renderer2, 
    private coursesService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    // Get the course ID from the route parameters
    this.route.params.subscribe(params => {
      if (params['cid']) {
        this.currentCourseId = params['cid'];
        const course = this.coursesMap.get(this.currentCourseId);
        this.cname.set(course ? course.name : 'Unknown Course');
        this.checkEnrollmentStatus();
      }
    });
  }

  private coursesMap = new Map(this.coursesService.courses.map(course => [course.cid, course]));
  
  @Input()
  set cid(uid: string) {
    if (uid) {
      this.currentCourseId = uid;
      const course = this.coursesMap.get(uid);
      this.cname.set(course ? course.name : 'Unknown Course');
      this.checkEnrollmentStatus();
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
}
