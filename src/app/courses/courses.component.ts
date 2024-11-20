import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CardComponent } from '../ccards/card/card.component';
import { cdata } from '../ccards/cdata';
import { TokenStorageService } from '../core/services/token-storage.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CardComponent, CommonModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  data = cdata;
  user: any = null;
  userInitial: string = '';
  isBrowser: boolean;

  constructor(
    private tokenStorage: TokenStorageService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.user = this.tokenStorage.getUser();
      if (this.user?.name) {
        this.userInitial = this.user.name.charAt(0).toUpperCase();
      }
    }
  }

  get welcomeMessage(): string {
    return this.user ? `Welcome, ${this.user.name}` : 'Welcome';
  }
}
