import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { bdata } from './blogdata';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  bdata = bdata;

  constructor(private router: Router) {}

  navigateToPost(id: number) {
    this.router.navigate(['/blog', id.toString()]);
  }
}
