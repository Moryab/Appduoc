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
      this.curso = navigationState; // Asignar el curso recibido
      this.generateQRText(this.curso); // Llamar al método para generar el texto del QR
    } else {
      this.loadCourses(); // Cargar los cursos al inicializar la página si no hay datos pasados
    }
  }

  // Método para cargar los cursos desde Firebase y generar el QR Text
  loadCourses() {
    this.firebaseService.getCourses().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
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
    const hora = fechaActual.toLocaleTimeString(); // Formato de hora

    // Generar el texto del QR
    this.qrText = `Curso: ${curso.nombre}, Sección: ${curso.seccion}, Profesor: ${curso.nombreProfesor}, Fecha: ${fecha}, Hora: ${hora}`;
    console.log('QR Text generado:', this.qrText); // Verificar el contenido del QR Text
  }

  guardarAsistencia() {
    if (!this.curso) {
      console.error('No se ha seleccionado un curso');
      return;
    }
  
    const fechaActual = new Date();
    const asistencia = {
      curso: this.curso.nombre, // Usar el curso seleccionado
      seccion: this.curso.seccion,
      profesor: this.curso.nombreProfesor,
      fecha: fechaActual.toLocaleDateString(),
      hora: fechaActual.toLocaleTimeString(),
      claseId: this.claseId, // Número de clase actual
    };
  
    this.firebaseService.guardarAsistencia(asistencia).then(() => {
      console.log('Asistencia guardada:', asistencia);
      this.claseId++; // Incrementar el número de clase para la próxima asistencia
    }).catch((error) => {
      console.error('Error al guardar la asistencia:', error);
    });
  }
  
}
