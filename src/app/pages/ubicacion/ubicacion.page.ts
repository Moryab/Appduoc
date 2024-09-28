import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  registrarAsistencia() {
    // Acción que registra la asistencia
    console.log('Asistencia registrada.');
  }

}
