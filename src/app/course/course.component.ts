import { Component, Input, Renderer2, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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

  constructor( private renderer: Renderer2, private coursesService: CourseService) {};

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

