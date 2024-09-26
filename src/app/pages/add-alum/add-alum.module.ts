import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAlumPageRoutingModule } from './add-alum-routing.module';

import { AddAlumPage } from './add-alum.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAlumPageRoutingModule,
    ComponentsModule
],
  declarations: [AddAlumPage]
})
export class AddAlumPageModule {}
