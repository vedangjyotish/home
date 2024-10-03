import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { CcardsComponent } from '../ccards/ccards.component';
import { AboutComponent } from '../about/about.component';
import { ScardsComponent } from '../scards/scards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeroComponent, CcardsComponent, AboutComponent, ScardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
