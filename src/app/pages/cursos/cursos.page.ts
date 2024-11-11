import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  cursos$: Observable<any[]>;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.cursos$ = this.firebaseService.getCourses();
  }

  verCursoDetalles(curso: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        nombre: curso.nombre,
        seccion: curso.seccion,
        nombreProfesor: curso.nombreProfesor,
        sigla: curso.sigla,
        correo: curso.correo,
        fechaCreacion: curso.fechaCreacion
      }
    };
    this.router.navigate(['/asistencias'], navigationExtras);
  }
}
