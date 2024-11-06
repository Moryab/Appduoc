import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeccionesPageRoutingModule } from './secciones-routing.module';

import { SeccionesPage } from './secciones.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeccionesPageRoutingModule,
    ComponentsModule
],
  declarations: [SeccionesPage]
})
export class SeccionesPageModule {}
