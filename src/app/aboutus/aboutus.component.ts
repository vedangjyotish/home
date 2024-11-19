import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Initialize AOS
    if (isPlatformBrowser(this.platformId)) {
      const AOS = (window as any).AOS;
      if (AOS) {
        AOS.init({
          duration: 1000,
          once: true,
          offset: 100
        });
      }
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      
      // Set video properties
      video.defaultMuted = true;
      video.muted = true;
      
      // Play video
      const playVideo = async () => {
        try {
          await video.play();
          console.log('Video playing successfully');
        } catch (err) {
          console.log('Error playing video:', err);
          // Retry play on user interaction
          if (typeof document !== 'undefined') {
            document.addEventListener('click', () => {
              video.play().catch(console.log);
            }, { once: true });
          }
        }
      };

      // Try to play immediately
      playVideo();

      // Add event listeners for debugging
      video.addEventListener('playing', () => {
        console.log('Video is playing');
      });

      video.addEventListener('pause', () => {
        console.log('Video is paused');
      });

      video.addEventListener('error', (e) => {
        console.log('Video error:', e);
      });

      // Handle visibility change
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            video.pause();
          } else {
            video.play().catch(console.log);
          }
        });
      }
    }
  }
}
