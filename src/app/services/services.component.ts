import { Component } from '@angular/core';
import { ScardsComponent } from '../scards/scards.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ScardsComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

}
