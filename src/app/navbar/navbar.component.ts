import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MobilemenuComponent } from './mobilemenu/mobilemenu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, MobilemenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
