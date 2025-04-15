import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];