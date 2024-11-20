import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CommonModule } from '@angular/common';
import { ICourse } from '../interfaces/course.interface';

@Component({
  selector: 'app-mods',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './mods.component.html',
  styleUrl: './mods.component.css'
})
export class ModsComponent implements OnInit {
  activeModuleIndex = signal(0);
  
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private currentCourse = signal<ICourse | null>(null);

  modules = computed(() => {
    return this.currentCourse()?.mods || [];
  });

  moduleList = computed(() => {
    const activeModule = this.modules()[this.activeModuleIndex()];
    return activeModule?.list || [];
  });

  ngOnInit() {
    // Get the course ID from the parent route
    const parentRoute = this.route.parent;
    if (parentRoute) {
      parentRoute.params.subscribe(params => {
        const cid = params['cid'];
        if (cid) {
          this.loadCourseData(cid);
        }
      });
    }
  }

  private loadCourseData(cid: string) {
    this.courseService.getCourseById(cid).subscribe({
      next: (course) => {
        if (course) {
          this.currentCourse.set(course);
        }
      },
      error: (error) => {
        console.error('Error loading course:', error);
      }
    });
  }

  toggleModuleActive(index: number) {
    this.activeModuleIndex.set(index);
  }
}
