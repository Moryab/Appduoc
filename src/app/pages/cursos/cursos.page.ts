import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';  // Importa Observable

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  cursos$: Observable<any[]>;  // Cambié a Observable para usar async pipe en el template

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadCourses();  // Llamada a la carga de cursos en el ngOnInit
  }

  loadCourses() {
    this.cursos$ = this.firebaseService.getCourses();  // Usamos el método del servicio que devuelve un Observable
  }
}
