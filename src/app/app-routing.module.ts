import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'cursos',
    loadChildren: () => import('./pages/cursos/cursos.module').then( m => m.CursosPageModule)
  },
  {
    path: 'asistencias',
    loadChildren: () => import('./pages/asistencias/asistencias.module').then( m => m.AsistenciasPageModule)
  },
  {
    path: 'detalle-asistencia',
    loadChildren: () => import('./pages/detalle-asistencia/detalle-asistencia.module').then( m => m.DetalleAsistenciaPageModule)
  },
  {
    path: 'add-alum',
    loadChildren: () => import('./pages/add-alum/add-alum.module').then( m => m.AddAlumPageModule)
  },
  {
    path: 'agregar-curso',
    loadChildren: () => import('./pages/agregar-curso/agregar-curso.module').then( m => m.AgregarCursoPageModule)
  },
  {
    path: 'asistencia-estud',
    loadChildren: () => import('./pages/asistencia-estud/asistencia-estud.module').then( m => m.AsistenciaEstudPageModule)
  },
  {
    path: 'curso-estud',
    loadChildren: () => import('./pages/curso-estud/curso-estud.module').then( m => m.CursoEstudPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
