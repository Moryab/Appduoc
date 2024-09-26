import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaEstudPageRoutingModule } from './asistencia-estud-routing.module';

import { AsistenciaEstudPage } from './asistencia-estud.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaEstudPageRoutingModule,
    ComponentsModule
],
  declarations: [AsistenciaEstudPage]
})
export class AsistenciaEstudPageModule {}
