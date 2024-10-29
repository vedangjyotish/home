import { Component, HostListener, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vedang';
  mobileScreen = signal(false);
  desktopScreen = signal(false);
  paddingTop = signal('13rem');
  slideSwitch = signal(false);
  slideUpSwitch = signal(false);

  private breakpointObserver = inject(BreakpointObserver);

  constructor(
    private viewportScroller: ViewportScroller,
  ) {
    this.observeScreenSize();
  }

  private observeScreenSize(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(({ matches }) => {
      this.mobileScreen.set(matches);
      this.paddingTop.set(matches ? '1rem' : '13rem');
      this.desktopScreen.set(!matches);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = this.viewportScroller.getScrollPosition()[1];

    if (scrollY >= 570 && !this.mobileScreen()) {
      this.slideUpSwitch.set(true);
    }

    if (scrollY >= 600 && !this.mobileScreen()) {
      this.slideSwitch.set(true);
    } else if (scrollY < 600 && this.desktopScreen()) {
      this.paddingTop.set('13rem');
      this.slideSwitch.set(false);
    }
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

