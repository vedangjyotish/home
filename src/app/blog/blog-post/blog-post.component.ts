import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { bdata } from '../blogdata';

interface BlogPost {
  bid: number;
  name: string;
  date: string;
  img: string;
  title: string;
  sub: string;
}

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      this.post = bdata.find(post => post.bid === id);
    });
  }
}
