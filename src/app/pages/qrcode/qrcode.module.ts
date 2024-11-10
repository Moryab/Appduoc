import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrcodePageRoutingModule } from './qrcode-routing.module';

import { QrcodePage } from './qrcode.page';

//QR
import { QrCodeModule } from 'ng-qrcode';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrCodeModule,
    QrcodePageRoutingModule,
    ComponentsModule
],
  declarations: [QrcodePage]
})
export class QrcodePageModule {}
