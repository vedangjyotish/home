import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MobilemenuComponent } from './mobilemenu/mobilemenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HeaderComponent, MenuComponent, MobilemenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() sSwitch!: boolean;
  @Input() sUpSwitch!: boolean;
  @Output() hamClick = new EventEmitter<void>();

  active = false;

  onHamClick(ev:any) {
    this.active = !this.active;
  }

  onSlideHamClick(ev:any) {
    console.log("clicked !");
    this.hamClick.emit();
  }

  slideMenuShow() {
    if (this.sSwitch) {
      return 'flex';
    } else {
      return 'none';
    }
  }

  slideUpShow() {
    if (this.sSwitch) {
      return 'none';
    } else {
      return 'flex';
    }
  }

  slided_up() {
    if (this.sUpSwitch) {
      return true;
    } else {
      return false;
    }
  }

}
