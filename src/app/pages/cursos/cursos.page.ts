import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  cursos: any[] = [];  // Variable para almacenar los cursos

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  async loadCourses() {
    try {
      this.cursos = await this.firebaseService.getCourses();
    } catch (error) {
      console.error("Error al cargar los cursos: ", error);
    }
  }

}
