import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAlumPage } from './add-alum.page';

const routes: Routes = [
  {
    path: '',
    component: AddAlumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAlumPageRoutingModule {}
