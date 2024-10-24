import { Component } from '@angular/core';
import { CardComponent } from '../ccards/card/card.component';
import { cdata } from '../ccards/cdata';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  data = cdata;

}
