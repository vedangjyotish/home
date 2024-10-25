import { Component, HostListener, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vedang';
  mobileScreen = signal(false);
  desktopScreen = signal(false);
  paddingTop = signal('13rem');
  slideSwitch = signal(false);
  slideUpSwitch = signal(false);

  breakpointObserver = inject(BreakpointObserver);

  constructor(
    private ViewportScroller: ViewportScroller,
    // private router: Router
  ) {
    this.breakpointObserver.observe([
      '(max-width: 768px)'
    ]).subscribe((result: BreakpointState)=>{
      if(result.matches){
        // console.log('Screen width is 768px of less');
        this.mobileScreen.set(true);
        this.paddingTop.set('1rem');
      } else{
        // console.log('Screen width is more than 600px');
        this.desktopScreen.set(true);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const position = this.ViewportScroller.getScrollPosition();
    const Y = position[1];

    // console.log(this.router.url === '/courses');

    // console.log(Y);

    if (Y >= 570 && this.mobileScreen() === false) {
      this.slideUpSwitch.set(true);
    }
    // console.log(this.slideUpSwitch());

    if (Y >= 600 && this.mobileScreen() === false) {
      // this.paddingTop.set('6rem');
      this.slideSwitch.set(true);
    } else if (Y < 600 && this.desktopScreen()) {
      this.paddingTop.set('13rem');
      this.slideSwitch.set(false);
    } else {
      // this.paddingTop.set('13rem');
      // this.slideSwitch.set(true);
    }
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }

}
