import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminAuthService } from '../../services/admin-auth.service';
import { MatIconModule } from '@angular/material/icon';

interface Course {
  id?: string;
  name: string;           // required
  description: string;    // required
  price: string;         // required, must start with ₹
  highlights: string[];  // required
  taglines: string[];    // required
  duration: string;      // required
  teacher_id?: string;   // optional
  image?: File;          // optional but either image or image_url must be present
  image_url?: string;    // optional but either image or image_url must be present
  image_alt?: string;    // optional, defaults to empty string
  videos?: string[];     // optional, defaults to empty list
  featured?: boolean;    // optional, defaults to false
  weekly_commitment?: string;  // optional, defaults to empty string
  prerequisites?: string[];    // optional, defaults to empty list
  learning_outcomes?: string[]; // optional, defaults to empty list
  language?: string;           // optional, defaults to 'English'
  certificate_offered?: boolean; // optional, defaults to true
  status?: string;             // optional, defaults to 'draft'
}

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class AdminCoursesComponent implements OnInit {
  private readonly API_URL = environment.apiUrl;
  courses = signal<Course[]>([]);
  isCreating = signal(false);
  isEditing = signal<string | undefined>(undefined);
  imageError = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService
  ) {}

  newCourse: Course = {
    name: '',
    description: '',
    price: '₹',
    highlights: [''],
    taglines: [''],
    duration: '',
    image_alt: '',
    videos: [],
    featured: false,
    weekly_commitment: '',
    prerequisites: [],
    learning_outcomes: [],
    language: 'English',
    certificate_offered: true,
    status: 'draft'
  };

  ngOnInit() {
    this.fetchCourses();
  }

  addHighlight() {
    this.newCourse.highlights.push('');
  }

  removeHighlight(index: number) {
    if (this.newCourse.highlights.length > 1) {
      this.newCourse.highlights.splice(index, 1);
    }
  }

  addTagline() {
    this.newCourse.taglines.push('');
  }

  removeTagline(index: number) {
    if (this.newCourse.taglines.length > 1) {
      this.newCourse.taglines.splice(index, 1);
    }
  }

  addVideo() {
    this.newCourse.videos = this.newCourse.videos || [];
    this.newCourse.videos.push('');
  }

  removeVideo(index: number) {
    if (this.newCourse.videos) {
      this.newCourse.videos.splice(index, 1);
    }
  }

  addPrerequisite() {
    this.newCourse.prerequisites = this.newCourse.prerequisites || [];
    this.newCourse.prerequisites.push('');
  }

  removePrerequisite(index: number) {
    if (!this.newCourse.prerequisites) return;
    this.newCourse.prerequisites.splice(index, 1);
  }

  addLearningOutcome() {
    this.newCourse.learning_outcomes = this.newCourse.learning_outcomes || [];
    this.newCourse.learning_outcomes.push('');
  }

  removeLearningOutcome(index: number) {
    if (!this.newCourse.learning_outcomes) return;
    this.newCourse.learning_outcomes.splice(index, 1);
  }

  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageError.set(null);
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.imageError.set('Only image files are allowed');
      return;
    }

    this.newCourse.image = file;
    delete this.newCourse.image_url;
  }

  validateCourse(): boolean {
    // Required fields validation
    if (!this.newCourse.name?.trim()) {
      return false;
    }
    if (!this.newCourse.description?.trim()) {
      return false;
    }
    if (!this.newCourse.price?.startsWith('₹')) {
      return false;
    }
    if (!this.newCourse.duration?.trim()) {
      return false;
    }

    // Validate highlights (required, non-empty)
    if (!this.newCourse.highlights?.length || this.newCourse.highlights.some(h => !h.trim())) {
      return false;
    }

    // Validate taglines (required, non-empty)
    if (!this.newCourse.taglines?.length || this.newCourse.taglines.some(t => !t.trim())) {
      return false;
    }

    // Image validation (either image or image_url must be present)
    if (!this.newCourse.image && !this.newCourse.image_url) {
      return false;
    }

    if (this.imageError()) {
      return false;
    }

    // Optional YouTube URLs validation (if present)
    if (this.newCourse.videos?.length) {
      if (this.newCourse.videos.some(url => url && !this.isValidYouTubeUrl(url))) {
        return false;
      }
    }

    return true;
  }

  isValidYouTubeUrl(url: string): boolean {
    if (!url) return true; // Empty URLs are allowed
    return url.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/) !== null;
  }

  async fetchCourses() {
    this.isLoading.set(true);
    try {
      const headers = this.authService.getAuthorizationHeaders();
      const data = await this.http.get<Course[]>(`${this.API_URL}/admin/courses/`, { headers }).toPromise();
      this.courses.set(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createCourse() {
    if (!this.validateCourse()) {
      this.error.set('Please fill in all required fields correctly');
      console.log('Validation failed. Current course data:', this.newCourse);
      return;
    }

    try {
      const formData = new FormData();
      console.log('Creating course with data:', this.newCourse);
      console.dir(this.newCourse, { depth: null });

      Object.entries(this.newCourse).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          console.log('Appending image file:', value.name);
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            console.log(`Appending array ${key}:`, value);
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'object' && value !== null) {
          console.log(`Appending object ${key}:`, value);
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          console.log(`Appending field ${key}:`, value);
          formData.append(key, value.toString());
        }
      });

      // Log the FormData contents
      console.log('FormData entries:');
      const formDataObj: Record<string, string | File> = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(key, `File: ${value.name}`);
          formDataObj[key] = value;
        } else {
          console.log(key, value);
          formDataObj[key] = value;
        }
      });
      console.log('FormData as object:', formDataObj);

      const headers = this.authService.getAuthorizationHeaders();
      console.log('Request headers:', headers);
      
      const response = await this.http.post(`${this.API_URL}/admin/courses/`, formData, { 
        headers,
        observe: 'response'
      }).toPromise();
      
      console.log('Server response:', response);
      
      this.message.set('Course created successfully!');
      this.error.set(null);
      await this.fetchCourses();
      this.resetForm();
    } catch (error: any) {
      console.error('Error creating course:', error);
      console.error('Error response:', error.error);
      console.error('Status:', error.status);
      console.error('Status text:', error.statusText);
      this.error.set(error.error?.message || error.message || 'Failed to create course');
      this.message.set(null);
    }
  }

  resetForm() {
    this.newCourse = {
      name: '',
      description: '',
      price: '₹',
      highlights: [''],
      taglines: [''],
      duration: '',
      image_alt: '',
      videos: [],
      featured: false,
      weekly_commitment: '',
      prerequisites: [],
      learning_outcomes: [],
      language: 'English',
      certificate_offered: true,
      status: 'draft'
    };
    this.isCreating.set(false);
    this.isEditing.set(undefined);
    this.imageError.set(null);
    this.error.set(null);
    this.message.set(null);
  }

  async startEdit(course: Course) {
    this.isEditing.set(course.id || undefined);
    this.newCourse = { ...course };
  }

  async updateCourse() {
    if (!this.validateCourse()) {
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(this.newCourse).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          // Only append non-empty arrays
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      const headers = this.authService.getAuthorizationHeaders();
      await this.http.put(`${this.API_URL}/admin/courses/${this.newCourse.id}/`, formData, { headers }).toPromise();
      await this.fetchCourses();
      this.resetForm();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }

  async deleteCourse(course: Course) {
    try {
      // Get base headers from auth service
      const baseHeaders = this.authService.getAuthorizationHeaders();
      
      // Add Content-Type header
      const headers = new HttpHeaders({
        ...baseHeaders.keys().reduce((acc, key) => ({ ...acc, [key]: baseHeaders.get(key)! }), {}),
        'Content-Type': 'application/json'
      });

      // Make the delete request using course.id (UUID)
      const response = await this.http.delete<{ message: string; error?: string }>(
        `${this.API_URL}/admin/courses/${course.id}/`,
        { headers }
      ).toPromise();

      if (response && 'error' in response) {
        throw new Error(response.error);
      }

      // Refresh the courses list
      await this.fetchCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error?.message || error);
      // You might want to show this error to the user through a notification service
    }
  }
}
