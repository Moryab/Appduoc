import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciaEstudPage } from './asistencia-estud.page';

const routes: Routes = [
  {
    path: '',
    component: AsistenciaEstudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciaEstudPageRoutingModule {}
