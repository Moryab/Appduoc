import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Curso } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {
  qrText: string = ''; // Variable para almacenar el QR
  cursos: Curso[] = []; // Aquí especificas que 'cursos' es un arreglo de objetos de tipo Curso
  claseId: number = 1; // Número de clase, inicializado en 1 para la primera clase

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadCourses(); // Cargar los cursos al inicializar la página
  }

  // Método para cargar los cursos desde Firebase y generar el QR Text
  loadCourses() {
    this.firebaseService.getCourses().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
        console.log('Cursos desde Firebase:', this.cursos);

        if (this.cursos.length > 0) {
          // Generar el texto QR usando el primer curso como ejemplo
          const curso = this.cursos[0];
          this.generateQRText(curso);
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

    this.qrText = `Curso: ${curso.nombre}, Sección: ${curso.seccion}, Profesor: ${curso.nombreProfesor}, Fecha: ${fecha}, Hora: ${hora}`;
    console.log('QR Text generado:', this.qrText); // Verificar el contenido del QR Text
  }

  // Método para guardar la asistencia en Firestore
  guardarAsistencia() {
    const fechaActual = new Date();
    const asistencia = {
      curso: this.cursos[0].nombre, // Usar el primer curso como ejemplo
      seccion: this.cursos[0].seccion,
      profesor: this.cursos[0].nombreProfesor,
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
