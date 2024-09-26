import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CursoEstudPage } from './curso-estud.page';

const routes: Routes = [
  {
    path: '',
    component: CursoEstudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursoEstudPageRoutingModule {}
