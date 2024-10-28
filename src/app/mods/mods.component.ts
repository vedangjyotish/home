import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CourseService } from '../ccards/courses.service';
import { CommonModule } from '@angular/common';

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
  cid = input.required<string>();

  private coursesService = inject(CourseService);

  activeModuleIndex = signal(0);

  private memoizedModules: Module[] | null = null;
  private memoizedCid: string | null = null;

  modules = computed<Module[]>(() => {
    if (this.memoizedCid === this.cid() && this.memoizedModules) {
      return this.memoizedModules;
    }

    const course = this.coursesService.courses.find((c) => c.cid === this.cid());
    this.memoizedModules = course?.mods || [];
    this.memoizedCid = this.cid();
    return this.memoizedModules;
  });


  moduleList = computed(() => {
    const course = this.coursesService.courses.find((c) => c.cid === this.cid());
    if (!course || !course.mods) {
      return [];
    }
    const module = course.mods[this.activeModuleIndex()];
    return module ? module.list : [];
  });

  toggleModuleActive(index: number) {
    this.activeModuleIndex.set(index);
  }
}
