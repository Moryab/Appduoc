import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/interfaces/ialumnos';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-asistencia-estud',
  templateUrl: './asistencia-estud.page.html',
  styleUrls: ['./asistencia-estud.page.scss'],
})
export class AsistenciaEstudPage implements OnInit {
  items: Alumno[] = [];

  constructor(private datosService: DatosService) { }

  ngOnInit() {
    this.loadInitialAlumnos();
  }

  loadInitialAlumnos() {
    this.datosService.getAlumnos(20).subscribe(response => { // Aqui poner valor de cuantos alumnos llamar "(20)""
      this.items = response.results; // Asigna los resultados al array de items
    });
  }

}
