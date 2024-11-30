import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/interfaces/ialumnos';
import { DatosService } from 'src/app/services/datos.service';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-asistencia-estud',
  templateUrl: './asistencia-estud.page.html',
  styleUrls: ['./asistencia-estud.page.scss'],
})
export class AsistenciaEstudPage implements OnInit {


  items: Alumno[] = [];
  historialScans: any[] = [];  // Almacena los escaneos
  alumnoId: string = ''; // ID del alumno actual

  constructor(
    private datosService: DatosService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    // Cargar alumnos
    this.loadHistorial();
    this.loadInitialAlumnos();
  }

  // Cargar los primeros 20 alumnos desde el servicio
  loadInitialAlumnos() {
    this.datosService.getAlumnos(20).subscribe(response => {
      this.items = response.results;
    });
  }

  // Cargar el historial de escaneos desde Firebase
  loadHistorial() {
    this.firebaseService.getHistorialScan(this.alumnoId).subscribe(historial => {
      console.log("Historial de escaneos:", historial);  // Verifica la estructura de los datos
      this.historialScans = historial;  // Asigna los datos al array 'historialScans'
    });
  }
}
