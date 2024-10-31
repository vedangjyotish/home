import { Routes } from '@angular/router';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { HomeComponent } from './home/home.component';
import { DevelopmentComponent } from './development/development.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './course/course.component';
import { ModsComponent } from './mods/mods.component';
import { InstructorComponent } from './instructor/instructor.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ServicesComponent } from './services/services.component';
import { BlogComponent } from './blog/blog.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactComponent } from './contact/contact.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';

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
    component: ServicesComponent,
  },
  {
    path: 'blogs',
    component: BlogComponent,
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
  },
  {
    path: 'contactus',
    component: ContactComponent,
  },
  {
    path: 'myaccount',
    component: AccountComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
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
