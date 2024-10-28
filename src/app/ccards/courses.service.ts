import { Injectable } from "@angular/core";

import { cdata } from '../ccards/cdata';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  get courses() {
    return cdata;
  }

}
