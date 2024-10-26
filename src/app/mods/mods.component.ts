import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cdata } from '../ccards/cdata';

@Component({
  selector: 'app-mods',
  standalone: true,
  imports: [],
  templateUrl: './mods.component.html',
  styleUrl: './mods.component.css'
})
export class ModsComponent {
  private data = cdata;

  Index:number = 0;

  mods:any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let cid = params['cid'];
      let mod = params['index'];
      // console.log(this.mod);
      // console.log(params);

      const course = this.data.find((el) => el.cid === cid);
      this.mods = course ? course.mods[mod] : [];

      this.mods.forEach((element) => {
        console.log(element);
      });

    })
  }
}
