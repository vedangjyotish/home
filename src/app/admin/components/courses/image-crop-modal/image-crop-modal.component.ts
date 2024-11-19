import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop-modal',
  templateUrl: './image-crop-modal.component.html',
  styleUrls: ['./image-crop-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ImageCropperModule]
})
export class ImageCropModalComponent {
  @Input() imageFile: File | null = null;
  @Output() croppedImage = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  
  @ViewChild('modal') modal!: ElementRef;

  showCropper = signal(false);
  currentCroppedImage = signal<string>('');

  readonly aspectRatio = 4/3; // For 800x600 dimensions
  readonly resizeToWidth = 800;
  readonly resizeToHeight = 600;

  imageCropped(event: ImageCroppedEvent) {
    console.log('Image cropped event received');
    if (event.base64) {
      console.log('Using base64');
      this.currentCroppedImage.set(event.base64);
    } else if (event.objectUrl) {
      console.log('Using objectUrl');
      this.currentCroppedImage.set(event.objectUrl);
    }
    console.log('Stored image length:', this.currentCroppedImage().length);
  }

  imageLoaded() {
    console.log('Image loaded');
    this.showCropper.set(true);
  }

  imageError() {
    console.error('Failed to load image');
    this.closeModal();
  }

  submitCrop() {
    console.log('Submit crop clicked');
    const croppedImage = this.currentCroppedImage();
    console.log('Current cropped image length:', croppedImage?.length || 0);
    if (croppedImage && croppedImage.length > 0) {
      console.log('Emitting cropped image');
      this.croppedImage.emit(croppedImage);
      this.closeModal();
    } else {
      console.log('No cropped image available');
      // Try to get the latest crop
      const cropperElement = document.querySelector('image-cropper');
      if (cropperElement) {
        console.log('Attempting to trigger manual crop');
        // Trigger a manual crop
        const cropEvent = new Event('imageCropped');
        cropperElement.dispatchEvent(cropEvent);
      }
    }
  }

  closeModal() {
    console.log('Closing modal');
    this.close.emit();
  }

  onModalClick(event: MouseEvent) {
    if (event.target === this.modal.nativeElement) {
      this.closeModal();
    }
  }
}
