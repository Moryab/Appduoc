import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CursoEstudPageRoutingModule } from './curso-estud-routing.module';

import { CursoEstudPage } from './curso-estud.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CursoEstudPageRoutingModule,
    ComponentsModule
],
  declarations: [CursoEstudPage]
})
export class CursoEstudPageModule {}
