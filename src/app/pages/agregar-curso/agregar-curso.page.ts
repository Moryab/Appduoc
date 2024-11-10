import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { Observable } from 'rxjs';
import { Curso } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.page.html',
  styleUrls: ['./agregar-curso.page.scss'],
})
export class AgregarCursoPage implements OnInit {
  seccion: string = '';
  sigla: string = '';
  nombre: string = '';
  nombreProfesor: string = ''; // Este es el nombre visible del profesor
  errorMessage: string = ''; // Variable para el mensaje de error
  cursos$: Observable<Curso[]>; // Cambié a Observable para usarlo con onSnapshot

  constructor(private firebaseService: FirebaseService,
              private router: Router) {}

  ngOnInit() {
    // Cargar los cursos del usuario logueado en tiempo real
    this.cursos$ = this.firebaseService.getCourses();
  }

  async agregarCurso() {
    // Validación: asegúrate de que los campos no estén vacíos
    if (!this.seccion || !this.sigla || !this.nombre || !this.nombreProfesor) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    try {
      const courseData = {
        seccion: this.seccion,
        sigla: this.sigla,
        nombre: this.nombre,
        nombreProfesor: this.nombreProfesor // El nombre visible del profesor
      };

      // Llama al servicio para guardar el curso en Firestore
      await this.firebaseService.addCourse(courseData);
      console.log("Curso agregado exitosamente");

      // Limpia los campos del formulario después de agregar el curso
      this.seccion = '';
      this.sigla = '';
      this.nombre = '';
      this.nombreProfesor = '';
      this.errorMessage = ''; // Limpiar mensaje de error

      // Redirigir a la página de cursos
      this.router.navigate(['/cursos']);
    } catch (error) {
      console.error("Error al agregar el curso:", error);
      this.errorMessage = 'Error al agregar el curso. Intenta nuevamente.';
    }
  }
}
