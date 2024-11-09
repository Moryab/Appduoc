import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciasPageRoutingModule } from './asistencias-routing.module';

import { AsistenciasPage } from './asistencias.page';
import { ComponentsModule } from "../../components/components.module";

import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciasPageRoutingModule,
    ComponentsModule,
    QRCodeModule
],
schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Añade esto
  declarations: [AsistenciasPage]
})
export class AsistenciasPageModule {}
