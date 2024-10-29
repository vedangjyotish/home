import { Component, Input, Renderer2, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CourseService } from '../ccards/courses.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  cname = signal('');
  
  activeTabIndex = signal(0)

  activeModuleIndex: number = 0;

  constructor( 
              private renderer: Renderer2, 
              private coursesService: CourseService,
              private router: Router
             ) { 
               // this.scrollToTop(); 
             };

   private scrollToTop() {
     this.router.events.subscribe((event) => {
       if (event instanceof NavigationEnd) {
         if (this.router.url.endsWith('/tabs/0')) {
           window.scrollTo(0, 1);
         }
       }
     }); 
   }

  private coursesMap = new Map(this.coursesService.courses.map(course => [course.cid, course]));
  @Input()
  set cid(uid: string) {
    const course = this.coursesMap.get(uid);
    this.cname.set(course ? course.name : 'Unknown Course');
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

