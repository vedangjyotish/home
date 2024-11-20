import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CourseService } from '../ccards/courses.service';
import { CommonModule } from '@angular/common';
import { cdata } from '../ccards/cdata';

interface Module {
  module: number;
  list: string[];
}

@Component({
  selector: 'app-mods',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './mods.component.html',
  styleUrl: './mods.component.css'
})
export class ModsComponent {
  cid = input<string>('c1'); // Set default value to 'c1'

  private coursesService = inject(CourseService);
  private readonly courseData = cdata;

  activeModuleIndex = signal(0);

  private memoizedModules: Module[] | null = null;
  private memoizedCid: string | null = null;

  modules = computed<Module[]>(() => {
    if (this.memoizedCid === this.cid() && this.memoizedModules) {
      return this.memoizedModules;
    }

    // Try to get course from service first
    const course = this.coursesService.courses.find((c) => c.cid === this.cid());
    if (course?.mods) {
      this.memoizedModules = course.mods;
    } else {
      // Fallback to static data if not found in service
      const staticCourse = this.courseData.find(c => c.cid === this.cid());
      this.memoizedModules = staticCourse?.mods || [];
    }
    
    this.memoizedCid = this.cid();
    return this.memoizedModules;
  });

  moduleList = computed(() => {
    // Try service first
    const course = this.coursesService.courses.find((c) => c.cid === this.cid());
    if (course?.mods) {
      const module = course.mods[this.activeModuleIndex()];
      return module ? module.list : [];
    }

    // Fallback to static data
    const staticCourse = this.courseData.find(c => c.cid === this.cid());
    if (!staticCourse?.mods) {
      return [];
    }
    const module = staticCourse.mods[this.activeModuleIndex()];
    return module ? module.list : [];
  });

  toggleModuleActive(index: number) {
    this.activeModuleIndex.set(index);
  }
}
