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

  loaded=false;
  cursos$: Observable<any[]>;
  cursos: any[] = []; // Nueva propiedad para almacenar los cursos una vez cargados

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.cursos$ = this.firebaseService.getCourses();
    this.cursos$.subscribe(cursos => {
      this.cursos = cursos; // Asigna los datos a cursos[]
      this.loaded = true; // Cambia loaded a true solo cuando los datos están cargados
    });
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
