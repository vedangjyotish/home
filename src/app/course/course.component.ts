import { Component, Input, Renderer2 } from '@angular/core';
import { cdata } from '../ccards/cdata';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  // Course data
  private data = cdata;

  // Course name to be displayed
  cname: string = '';
  
  // Index of the currently active tab
  activeTabIndex: number = 0;

  // Index of the currently active module
  activeModuleIndex: number = 0;

  // Input property to receive course ID from the parent component
  @Input()
  set cid(uid: string) {
    // Find the course name based on the course ID and assign it to cname
    const course = this.data.find((el) => el.cid === uid);
    this.cname = course ? course.name : 'Unknown Course';
  }

  constructor( private renderer: Renderer2) {};

  // Method to handle tab switching and move the underline element
  showContents(event: Event, element: HTMLElement, index: number) {
    event.preventDefault();

    // Handle tab switching
    this.updateActiveTab(index);
    this.updateUnderlinePosition(event, element, index);
  }

  // Method to update the active tab index
  private updateActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  // Method to update the underline position
  private updateUnderlinePosition(event: Event, element: HTMLElement, index: number) {
    event.preventDefault(); // Prevent default anchor navigation

    // Update the active tab index
    this.activeTabIndex = index;

    // Get target element dimensions
    const targetLink = event.target as HTMLAnchorElement;
    const offsetWidth = targetLink.offsetWidth;
    const offsetLeft = targetLink.offsetLeft;
    
    

    // Adjust the width and position of the underline element
    this.renderer.setStyle(element, 'width', `${offsetWidth}px`);
    this.renderer.setStyle(element, 'left', `${offsetLeft}px`);
  }

  toggleModuleActive(index: number) {
    this.activeModuleIndex = index;
  }
}

