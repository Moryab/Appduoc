import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Curso } from 'src/app/interfaces/usuario';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {
  curso: Curso; // Define the course variable
  qrText: string = ''; // Variable para almacenar el QR
  cursos: Curso[] = []; // Aquí especificas que 'cursos' es un arreglo de objetos de tipo Curso
  claseId: number = 1; // Número de clase, inicializado en 1 para la primera clase

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    // Obtener los datos del curso pasados a esta página
    const navigationState = this.router.getCurrentNavigation()?.extras.state as Curso;
    console.log('Datos del curso recibidos:', navigationState);

    if (navigationState) {
      // Si hay datos en navigationState, asignarlos al curso y generar el texto QR
      console.log('Datos del curso recibidos en navigationState:', navigationState);
      this.curso = navigationState;
      this.generateQRText(this.curso);
    } else {
      // Si no hay datos, cargar los cursos desde Firebase
      this.loadCourses();
    }
  }

  // Método para cargar los cursos desde Firebase y generar el QR Text
  loadCourses() {
    this.firebaseService.getCourses().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
        // Agregar log para depurar los cursos recibidos de Firebase
        console.log('Cursos desde Firebase:', this.cursos);

        if (this.cursos.length > 0 && !this.curso) {
          // Usar el primer curso solo si no se ha recibido uno desde la navegación
          this.curso = this.cursos[0];
          this.generateQRText(this.curso);
        }
      },
      error: (err) => {
        console.error('Error al cargar los cursos:', err);
      }
    });
  }

  // Método para generar el texto del QR
  generateQRText(curso: Curso) {
    const fechaActual = new Date();
    const fecha = fechaActual.toLocaleDateString(); // Formato de fecha

    // Calcular claseId basado en la fecha
    this.claseId = this.calculateClaseId(fechaActual);

    // Generar el texto del QR incluyendo la sigla del curso y claseId
    this.qrText = `Curso: ${curso.nombre}, Sección: ${curso.seccion}, Sigla: ${curso.sigla}, Profesor: ${curso.nombreProfesor}, Fecha: ${fecha}, Clase: ${this.claseId}`;
    console.log('QR Text generado:', this.qrText); // Verificar el contenido del QR Text
  }

  // Método para calcular el número de clase en función de la fecha
  calculateClaseId(fecha: Date): number {
    // Establecer una fecha base (puede ser la primera fecha de clase, por ejemplo)
    const fechaBase = new Date('2024-12-01'); // Cambia esta fecha base según tu calendario de clases
    const diferenciaEnDias = Math.floor((fecha.getTime() - fechaBase.getTime()) / (1000 * 3600 * 24)); // Diferencia en días
    return diferenciaEnDias + 1; // Clase 1 corresponde al primer día, clase 2 al segundo, etc.
  }

  // Método para guardar la asistencia
  guardarAsistencia() {
    if (!this.curso) {
      console.error('No se ha seleccionado un curso');
      return;
    }

    const fechaActual = new Date();
    const asistencia = {
      curso: this.curso.nombre,      // Nombre del curso seleccionado
      seccion: this.curso.seccion,  // Sección del curso
      profesor: this.curso.nombreProfesor, // Nombre del profesor
      sigla: this.curso.sigla,      // Sigla única del curso
      fecha: fechaActual.toLocaleDateString(), // Fecha actual en formato local
      claseId: this.claseId,        // Identificador único para la clase
    };

    this.firebaseService.guardarAsistencia(asistencia).then(() => {
      console.log('Asistencia guardada:', asistencia);
      this.claseId++; // Incrementar el número de clase para la próxima asistencia
    }).catch((error) => {
      console.error('Error al guardar la asistencia:', error);
    });
  }
}
