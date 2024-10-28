import { Routes } from '@angular/router';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { HomeComponent } from './home/home.component';
import { DevelopmentComponent } from './development/development.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';
import path from 'path';
import { ModsComponent } from './mods/mods.component';
import { TabsComponent } from './tabs/tabs.component';
import { InstructorComponent } from './instructor/instructor.component';
import { ReviewsComponent } from './reviews/reviews.component';

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
    children: [
      {
        path: 'tabs/0',
        component: ModsComponent,
      },
      {
        path: 'tabs/1',
        component: InstructorComponent,
      },
      {
        path: 'tabs/2',
        component: ReviewsComponent,
      },
      {
        path: '',
        redirectTo: 'tabs/0',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'development',
    component: DevelopmentComponent,
  }
];
