import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAsistenciaPageRoutingModule } from './detalle-asistencia-routing.module';

import { DetalleAsistenciaPage } from './detalle-asistencia.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAsistenciaPageRoutingModule,
    ComponentsModule
],
  declarations: [DetalleAsistenciaPage]
})
export class DetalleAsistenciaPageModule {}
