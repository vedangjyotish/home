import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Course {
  id?: string;
  name: string;
  image: string;
  highlights: string[];
  tagline: string[];
  price: number;
  modules: string[][];
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminCoursesComponent {
  courses = signal<Course[]>([]);
  isCreating = signal(false);
  isEditing = signal<string | null>(null);
  imageError = signal<string | null>(null);

  newCourse: Course = {
    name: '',
    image: '',
    highlights: ['', '', ''],
    tagline: ['', ''],
    price: 0,
    modules: [[]]
  };

  addModule() {
    this.newCourse.modules.push([]);
  }

  removeModule(index: number) {
    this.newCourse.modules.splice(index, 1);
  }

  addModuleItem(moduleIndex: number) {
    if (this.newCourse.modules[moduleIndex].length < 10) {
      this.newCourse.modules[moduleIndex].push('');
    }
  }

  removeModuleItem(moduleIndex: number, itemIndex: number) {
    this.newCourse.modules[moduleIndex].splice(itemIndex, 1);
  }

  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageError.set(null);
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      this.imageError.set('Only JPG/JPEG files are allowed');
      return;
    }

    // Validate file size (100KB = 102400 bytes)
    if (file.size > 102400) {
      this.imageError.set('Image size must be less than 100KB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.newCourse.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  validateCourse(): boolean {
    if (!this.newCourse.name || !this.newCourse.image || !this.newCourse.price) {
      return false;
    }
    
    if (this.imageError()) {
      return false;
    }

    if (this.newCourse.highlights.some(h => !h) || this.newCourse.tagline.some(t => !t)) {
      return false;
    }

    if (this.newCourse.modules.some(module => module.length === 0 || module.some(item => !item))) {
      return false;
    }

    return true;
  }

  createCourse() {
    if (!this.validateCourse()) {
      return;
    }

    const course = {
      ...this.newCourse,
      id: Date.now().toString()
    };

    this.courses.update(courses => [...courses, course]);
    this.resetForm();
  }

  resetForm() {
    this.newCourse = {
      name: '',
      image: '',
      highlights: ['', '', ''],
      tagline: ['', ''],
      price: 0,
      modules: [[]]
    };
    this.isCreating.set(false);
  }

  startEdit(course: Course) {
    this.isEditing.set(course.id!);
    this.newCourse = { ...course };
  }

  updateCourse() {
    if (!this.validateCourse()) {
      return;
    }

    this.courses.update(courses => 
      courses.map(course => 
        course.id === this.isEditing() ? { ...this.newCourse } : course
      )
    );
    
    this.isEditing.set(null);
    this.resetForm();
  }

  deleteCourse(id: string) {
    this.courses.update(courses => courses.filter(course => course.id !== id));
  }
}
