import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminAuthService } from '../../services/admin-auth.service';

interface Course {
  id: string;  // UUID of the course
  cid: string; // Course code (e.g., PYTHON101)
  name: string;
  price: string;
  image?: File;
  image_url?: string;
  image_alt?: string;
  highlights: string[];
  taglines: string[];
  duration: string;
  videos: string[];
  rating?: number;
  featured?: boolean;
  description?: string;
  weekly_commitment?: string;
  prerequisites?: string[];
  learning_outcomes?: string[];
  language?: string;
  certificate_offered?: boolean;
  modules_data?: {
    module: number;
    list: string[];
    m_price?: string;
  }[];
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminCoursesComponent implements OnInit {
  private readonly API_URL = environment.apiUrl;
  courses = signal<Course[]>([]);
  isCreating = signal(false);
  isEditing = signal<string | null>(null);
  imageError = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService
  ) {}

  newCourse: Course = {
    id: '',
    cid: '',
    name: '',
    price: '₹0',
    highlights: [''],
    taglines: [''],
    duration: '',
    videos: [],
    rating: 0,
    featured: false,
    prerequisites: [], // Initialize empty array
    learning_outcomes: [], // Initialize empty array
    language: 'English',
    certificate_offered: true,
    modules_data: [] // Initialize empty array
  };

  ngOnInit() {
    this.fetchCourses();
  }

  addModule() {
    this.newCourse.modules_data = this.newCourse.modules_data || [];
    this.newCourse.modules_data.push({
      module: this.newCourse.modules_data.length + 1,
      list: [''],
      m_price: '₹0'
    });
  }

  removeModule(index: number) {
    if (!this.newCourse.modules_data) return;
    this.newCourse.modules_data.splice(index, 1);
    // Update module numbers
    this.newCourse.modules_data.forEach((module, idx) => {
      module.module = idx + 1;
    });
  }

  addModuleItem(moduleIndex: number) {
    if (!this.newCourse.modules_data?.[moduleIndex]) return;
    this.newCourse.modules_data[moduleIndex].list.push('');
  }

  removeModuleItem(moduleIndex: number, itemIndex: number) {
    if (!this.newCourse.modules_data?.[moduleIndex]) return;
    this.newCourse.modules_data[moduleIndex].list.splice(itemIndex, 1);
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
    this.newCourse.videos.push('');
  }

  removeVideo(index: number) {
    this.newCourse.videos.splice(index, 1);
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
    if (!this.newCourse.id || !this.newCourse.cid || !this.newCourse.name || !this.newCourse.price || !this.newCourse.duration) {
      return false;
    }
    
    if (!this.newCourse.image && !this.newCourse.image_url) {
      return false;
    }

    if (this.imageError()) {
      return false;
    }

    if (!this.newCourse.highlights.length || this.newCourse.highlights.some(h => !h)) {
      return false;
    }

    if (!this.newCourse.taglines.length || this.newCourse.taglines.some(t => !t)) {
      return false;
    }

    if (this.newCourse.modules_data?.some(module => !module.list.length || module.list.some(item => !item))) {
      return false;
    }

    // Validate price format
    if (!this.newCourse.price.startsWith('₹')) {
      return false;
    }

    // Validate module prices
    if (this.newCourse.modules_data?.some(module => module.m_price && !module.m_price.startsWith('₹'))) {
      return false;
    }

    // Validate YouTube URLs
    if (this.newCourse.videos.some(url => !this.isValidYouTubeUrl(url))) {
      return false;
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
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(this.newCourse).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const headers = this.authService.getAuthorizationHeaders();
      await this.http.post(`${this.API_URL}/admin/courses/`, formData, { headers }).toPromise();
      await this.fetchCourses();
      this.resetForm();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  }

  resetForm() {
    this.newCourse = {
      id: '',
      cid: '',
      name: '',
      price: '₹0',
      highlights: [''],
      taglines: [''],
      duration: '',
      videos: [],
      rating: 0,
      featured: false,
      prerequisites: [],
      learning_outcomes: [],
      language: 'English',
      certificate_offered: true,
      modules_data: []
    };
    this.isCreating.set(false);
    this.isEditing.set(null);
    this.imageError.set(null);
  }

  async startEdit(course: Course) {
    this.isEditing.set(course.cid);
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
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
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
