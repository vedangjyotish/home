import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminAuthService } from '../../services/admin-auth.service';
import { MatIconModule } from '@angular/material/icon';

interface Module {
  id?: string;
  module_number: number;
  module_price: string;
  topics: string[];
}

interface Teacher {
  id?: string;
  name: string;
  qualification?: string;
  profile_image?: string;
  bio?: string;
}

interface Course {
  id?: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  image?: File;
  image_url?: string;
  image_alt?: string;
  highlights: string[];
  taglines: string[];
  videos?: string[];
  modules?: Module[];
  featured?: boolean;
  certificate_offered?: boolean;
  weekly_commitment?: string;
  prerequisites: string[];
  learning_outcomes: string[];
  language?: string;
  status?: string;
  rating?: number;
  teacher?: Teacher;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
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
  courseForm!: FormGroup;
  previewImageUrl = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AdminAuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  private initForm() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      image: [null],
      image_url: [''],
      image_alt: [''],
      highlights: this.fb.array([this.fb.control('', Validators.required)]),
      taglines: this.fb.array([this.fb.control('', Validators.required)]),
      videos: this.fb.array([]),
      prerequisites: this.fb.array([]),
      learning_outcomes: this.fb.array([]),
      featured: [false],
      certificate_offered: [true],
      weekly_commitment: [''],
      language: ['English'],
      status: ['draft'],
      teacher: this.fb.group({
        name: [''],
        qualification: [''],
        profile_image: [''],
        bio: ['']
      })
    });
  }

  get highlights() {
    return this.courseForm.get('highlights') as FormArray;
  }

  get taglines() {
    return this.courseForm.get('taglines') as FormArray;
  }

  get videos() {
    return this.courseForm.get('videos') as FormArray;
  }

  get prerequisites() {
    return this.courseForm.get('prerequisites') as FormArray;
  }

  get learningOutcomes() {
    return this.courseForm.get('learning_outcomes') as FormArray;
  }

  getControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  addHighlight() {
    this.highlights.push(this.fb.control('', Validators.required));
  }

  removeHighlight(index: number) {
    if (this.highlights.length > 1) {
      this.highlights.removeAt(index);
    }
  }

  addTagline() {
    this.taglines.push(this.fb.control('', Validators.required));
  }

  removeTagline(index: number) {
    if (this.taglines.length > 1) {
      this.taglines.removeAt(index);
    }
  }

  ngOnInit() {
    this.fetchCourses();
  }

  addVideo() {
    (this.courseForm.get('videos') as FormArray).push(this.fb.control(''));
  }

  removeVideo(index: number) {
    (this.courseForm.get('videos') as FormArray).removeAt(index);
  }

  addPrerequisite() {
    (this.courseForm.get('prerequisites') as FormArray).push(this.fb.control(''));
  }

  removePrerequisite(index: number) {
    (this.courseForm.get('prerequisites') as FormArray).removeAt(index);
  }

  addLearningOutcome() {
    (this.courseForm.get('learning_outcomes') as FormArray).push(this.fb.control(''));
  }

  removeLearningOutcome(index: number) {
    (this.courseForm.get('learning_outcomes') as FormArray).removeAt(index);
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        this.imageError.set('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {  
        this.imageError.set('File is too large. Maximum size is 5MB.');
        return;
      }

      this.imageError.set(null);
      
      // Store the actual file for form submission
      this.courseForm.patchValue({ image: file });
      
      // Create a preview URL only for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        // Store preview URL in a separate signal or variable
        this.previewImageUrl.set(previewUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  validateCourse(): boolean {
    // Required fields validation
    if (!this.courseForm.get('name')?.value?.trim()) {
      this.error.set('Course name is required');
      return false;
    }
    if (!this.courseForm.get('description')?.value?.trim()) {
      this.error.set('Course description is required');
      return false;
    }

    // Price validation and formatting
    let price = this.courseForm.get('price')?.value?.trim();
    if (!price) {
      this.error.set('Course price is required');
      return false;
    }
    // Add ₹ symbol if not present
    if (!price.startsWith('₹')) {
      price = `₹${price}`;
      this.courseForm.patchValue({ price });
    }

    if (!this.courseForm.get('duration')?.value?.trim()) {
      this.error.set('Course duration is required');
      return false;
    }

    // Validate highlights (required, non-empty)
    const highlights = this.highlights.controls;
    if (!highlights.length || highlights.some(h => !h.value?.trim())) {
      this.error.set('At least one non-empty highlight is required');
      return false;
    }

    // Validate taglines (required, non-empty)
    const taglines = this.taglines.controls;
    if (!taglines.length || taglines.some(t => !t.value?.trim())) {
      this.error.set('At least one non-empty tagline is required');
      return false;
    }

    // Image validation (either image or image_url must be present)
    const hasImage = this.courseForm.get('image')?.value instanceof File;
    const hasImageUrl = this.courseForm.get('image_url')?.value?.trim();
    if (!hasImage && !hasImageUrl) {
      this.error.set('Course image is required');
      return false;
    }

    if (this.imageError()) {
      return false;
    }

    // Optional YouTube URLs validation (if present)
    const videos = (this.courseForm.get('videos') as FormArray).controls;
    if (videos.length > 0) {
      const invalidUrls = videos.filter(url => url.value?.trim() && !this.isValidYouTubeUrl(url.value));
      if (invalidUrls.length > 0) {
        this.error.set('One or more YouTube URLs are invalid');
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

  createCourse() {
    console.log('Form values before validation:', {
      name: this.courseForm.get('name')?.value,
      description: this.courseForm.get('description')?.value,
      price: this.courseForm.get('price')?.value,
      duration: this.courseForm.get('duration')?.value,
      image: this.courseForm.get('image')?.value,
      image_url: this.courseForm.get('image_url')?.value,
      highlights: this.highlights.value,
      taglines: this.taglines.value
    });

    if (!this.validateCourse()) {
      console.error('Validation failed. Error:', this.error());
      return;
    }

    try {
      const formData = new FormData();
      const formValue = this.courseForm.value;
      
      // Handle basic fields
      Object.entries(formValue).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          // Send the original file
          formData.append('image', value);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            const processedValue = value.map(v => typeof v === 'object' ? v.value : v).filter(v => v);
            formData.append(key, JSON.stringify(processedValue));
          }
        } else if (key !== 'image_url' && typeof value === 'object' && value !== null) {
          // Skip image_url when appending to FormData
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '' && key !== 'image_url') {
          // Skip image_url when appending to FormData
          formData.append(key, value.toString());
        }
      });

      const headers = this.authService.getAuthorizationHeaders();
      
      this.http.post(`${this.API_URL}/admin/courses/`, formData, { 
        headers,
        observe: 'response'
      }).subscribe({
        next: (response) => {
          this.message.set('Course created successfully!');
          this.error.set(null);
          this.fetchCourses();
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Error creating course:', error);
          this.error.set(error.error?.message || error.message || 'Failed to create course');
          this.message.set(null);
        }
      });
    } catch (error: any) {
      console.error('Error creating course:', error);
      this.error.set(error.error?.message || error.message || 'Failed to create course');
      this.message.set(null);
    }
  }

  resetForm() {
    this.courseForm.reset({
      name: '',
      description: '',
      price: '',
      duration: '',
      image: null,
      image_url: '',
      image_alt: '',
      highlights: [''],
      taglines: [''],
      videos: [],
      prerequisites: [],
      learning_outcomes: [],
      featured: false,
      certificate_offered: true,
      weekly_commitment: '',
      language: 'English',
      status: 'draft',
      teacher: {
        name: '',
        qualification: '',
        profile_image: '',
        bio: ''
      }
    });
    this.isCreating.set(false);
    this.isEditing.set(undefined);
    this.imageError.set(null);
    this.error.set(null);
    this.message.set(null);
    this.previewImageUrl.set(null);
  }

  startEdit(course: Course, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isLoading.set(true);
    const headers = this.authService.getAuthorizationHeaders();
    
    // Fetch full course details
    this.http.get<Course>(`${this.API_URL}/admin/courses/${course.id}/`, { headers })
      .subscribe({
        next: (courseDetails) => {
          console.log('Received course details:', courseDetails);
          
          // Initialize the form with all the course details
          this.courseForm.patchValue({
            ...courseDetails,  
            highlights: Array.isArray(courseDetails.highlights) ? courseDetails.highlights : [''],
            taglines: Array.isArray(courseDetails.taglines) ? courseDetails.taglines : [''],
            videos: Array.isArray(courseDetails.videos) ? courseDetails.videos : [],
            prerequisites: Array.isArray(courseDetails.prerequisites) ? courseDetails.prerequisites : [],
            learning_outcomes: Array.isArray(courseDetails.learning_outcomes) ? courseDetails.learning_outcomes : [],
            image_url: courseDetails.image_url || '',
            image_alt: courseDetails.image_alt || '',
            language: courseDetails.language || 'English',
            weekly_commitment: courseDetails.weekly_commitment || '',
            featured: courseDetails.featured || false,
            certificate_offered: courseDetails.certificate_offered ?? true,
            status: courseDetails.status || 'draft',
            teacher: courseDetails.teacher || { 
              id: '',
              name: '',
              qualification: '',
              profile_image: '',
              bio: ''
            }
          });
          
          console.log('Processed course data:', this.courseForm.value);
          this.isEditing.set(course.id);
          this.isLoading.set(false);
          this.error.set(null);
          this.message.set(null);
        },
        error: (error) => {
          console.error('Error fetching course details:', error);
          this.error.set('Failed to load course details. Please try again.');
          this.isLoading.set(false);
        }
      });
  }

  updateCourse() {
    if (!this.validateCourse()) {
      this.error.set('Please fill in all required fields');
      return;
    }

    this.isLoading.set(true);
    const headers = this.authService.getAuthorizationHeaders();
    const formData = new FormData();
    
    // Append all course data to formData
    Object.entries(this.courseForm.value).forEach(([key, value]) => {
      if (key === 'id' || key === 'created_at' || key === 'updated_at' || key === 'rating') {
        // Skip these fields as they shouldn't be updated
        return;
      }
      
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (key === 'teacher' && value) {
        // Only send teacher name
        formData.append('teacher[name]', (value as Teacher).name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const courseId = this.isEditing();
    if (!courseId) {
      this.error.set('Course ID not found');
      this.isLoading.set(false);
      return;
    }

    this.http.put(`${this.API_URL}/admin/courses/${courseId}/`, formData, { headers })
      .subscribe({
        next: () => {
          this.message.set('Course updated successfully');
          this.isLoading.set(false);
          this.resetForm();
          this.fetchCourses(); 
        },
        error: (error) => {
          console.error('Error updating course:', error);
          this.error.set('Failed to update course. Please try again.');
          this.isLoading.set(false);
        }
      });
  }

  async deleteCourse(course: Course, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
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

  get image_url() {
    return this.previewImageUrl() || this.courseForm.get('image_url')?.value;
  }

  get image_alt() {
    return this.courseForm.get('image_alt')?.value || this.courseForm.get('name')?.value;
  }

  formatPrice(event: Event) {
    const input = event.target as HTMLInputElement;
    let price = input.value.trim();
    
    // Remove any existing ₹ symbol first
    price = price.replace('₹', '');
    
    // Add ₹ symbol if there's any content
    if (price) {
      price = `₹${price}`;
    }
    
    this.courseForm.patchValue({ price }, { emitEvent: false });
  }

  displayPrice(price: string): string {
    // Remove the ₹ symbol if it exists and trim any whitespace
    return price.replace('₹', '').trim();
  }
}
