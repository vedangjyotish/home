import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { MatIconModule } from '@angular/material/icon';

interface Course {
  id?: string;
  name: string;
  description: string;
  price: string;
  highlights: string[];
  taglines: string[];
  duration: string;
  teacher_id?: string;
  image?: File;
  image_url?: string;
  image_alt?: string;
  videos?: string[];
  featured?: boolean;
  weekly_commitment?: string;
  prerequisites: string[];
  learning_outcomes: string[];
  language?: string;
  certificate_offered?: boolean;
  status?: string;
}

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  course: Course = {
    name: '',
    description: '',
    price: '',
    highlights: [],
    taglines: [],
    duration: '',
    prerequisites: [],
    learning_outcomes: []
  };
  
  isLoading = signal(true);
  imageError = signal('');
  courseId: string | null = null;

  constructor(
    private http: HttpClient,
    private adminAuth: AdminAuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCourse();
    } else {
      this.isLoading.set(false);
    }
  }

  private loadCourse() {
    const headers = this.adminAuth.getAuthorizationHeaders();
    this.http.get<Course>(`${environment.apiUrl}/courses/${this.courseId}`, { headers })
      .subscribe({
        next: (data) => {
          this.course = {
            ...data,
            highlights: data.highlights || [],
            taglines: data.taglines || [],
            prerequisites: data.prerequisites || [],
            learning_outcomes: data.learning_outcomes || []
          };
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.isLoading.set(false);
        }
      });
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5000000) {
        this.imageError.set('Image size should be less than 5MB');
        return;
      }
      this.imageError.set('');
      this.course.image = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.course.image_url = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addItem(array: string[], value: string) {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      array.push(trimmedValue);
    }
  }

  removeItem(array: string[], index: number) {
    array.splice(index, 1);
  }

  async saveCourse() {
    const headers = this.adminAuth.getAuthorizationHeaders();
    const formData = new FormData();
    
    // Append all course data to formData
    Object.entries(this.course).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      if (this.courseId) {
        await this.http.put(`${environment.apiUrl}/courses/${this.courseId}`, formData, { headers }).toPromise();
      } else {
        await this.http.post(`${environment.apiUrl}/courses`, formData, { headers }).toPromise();
      }
      this.router.navigate(['/admin/courses']);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  }

  navigateBack() {
    this.router.navigate(['/admin/courses']);
  }
}
