import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.page.html',
  styleUrls: ['./agregar-curso.page.scss'],
})
export class AgregarCursoPage {
  seccion: string = '';
  sigla: string = '';
  nombre: string = '';
  profesor: string = '';

  constructor(private firebaseService: FirebaseService) {}

  async agregarCurso() {
    try {
      const courseData = {
        seccion: this.seccion,
        sigla: this.sigla,
        nombre: this.nombre,
        profesor: this.profesor
      };

      // Llama al servicio para guardar el curso en Firestore
      await this.firebaseService.addCourse(courseData);
      console.log("Curso agregado exitosamente");

      // Limpia los campos del formulario después de agregar el curso
      this.seccion = '';
      this.sigla = '';
      this.nombre = '';
      this.profesor = '';
    } catch (error) {
      console.error("Error al agregar el curso:", error);
    }
  }
}
