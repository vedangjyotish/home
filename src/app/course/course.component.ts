import { Component, Input } from '@angular/core';
import { cdata } from '../ccards/cdata'

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  data = cdata;
  cname:string = '';


  // @Input({required: true}) cid!: string;
  @Input()
  set cid(uid: string) {
    this.cname = (this.data.find((el) => el.cid === uid)?.name)!
  }

}
