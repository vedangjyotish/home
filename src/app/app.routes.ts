import { Routes } from '@angular/router';
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
import { ADMIN_ROUTES } from './admin/admin-routing';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { PaymentUploadComponent } from './payment-upload/payment-upload.component';
import { EnrollmentSuccessComponent } from './enrollment-success/enrollment-success.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    children: ADMIN_ROUTES
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
    path: 'blog/:id',
    loadComponent: () => import('./blog/blog-post/blog-post.component').then(c => c.BlogPostComponent)
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
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
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
  },
  {
    path: 'students', loadChildren: () => import('./students/students.module').then(m => m.StudentsModule)
  },
  {
    path: 'members', loadChildren: () => import('./members/members.module').then(m => m.MembersModule)
  },
  {
    path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'payment-upload',
    component: PaymentUploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enrollment-success',
    component: EnrollmentSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
