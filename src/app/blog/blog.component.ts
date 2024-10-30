import { Component } from '@angular/core';
import { bdata } from './blogdata';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  bdata = bdata;
}
