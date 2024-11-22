import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './admin/services/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withViewTransitions(),
      withComponentInputBinding()
    ),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor])
    ),
    provideAnimations()
  ]
};
