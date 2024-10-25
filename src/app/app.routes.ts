import { Routes } from '@angular/router';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { HomeComponent } from './home/home.component';
import { DevelopmentComponent } from './development/development.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'services',
    component: ComingsoonComponent,
  },
  {
    path: 'blogs',
    component: ComingsoonComponent,
  },
  {
    path: 'appointment',
    component: ComingsoonComponent,
  },
  {
    path: 'aboutus',
    component: ComingsoonComponent,
  },
  {
    path: 'contactus',
    component: ComingsoonComponent,
  },
  {
    path: 'myaccount',
    component: ComingsoonComponent,
  },
  {
    path: 'cart',
    component: ComingsoonComponent,
  },
  {
    path: 'course/:cid',
    component: CourseComponent,
  },
  {
    path: 'development',
    component: DevelopmentComponent,
  }
];
