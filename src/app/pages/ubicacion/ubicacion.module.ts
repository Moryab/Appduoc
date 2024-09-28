import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbicacionPageRoutingModule } from './ubicacion-routing.module';

import { UbicacionPage } from './ubicacion.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicacionPageRoutingModule,
    ComponentsModule
],
  declarations: [UbicacionPage]
})
export class UbicacionPageModule {}
