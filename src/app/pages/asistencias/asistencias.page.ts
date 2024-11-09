import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  items: string[] = [];
  qrData: string = ''; // Variable para almacenar el QR
  cursos: any[] = [];  // Declarar la propiedad cursos como un arreglo vacío


  constructor(
    private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService, // Inyectamos ActivatedRoute para acceder a los parámetros
  ) { }

  ngOnInit() {
    this.loadCourses(); // Cargar los cursos al inicializar la página

  }

  // Asumiendo que 'cursos' es un array de los cursos obtenidos desde Firebase
  async loadCourses() {
    this.cursos = await this.firebaseService.getCourses();
    console.log('Cursos desde Firebase:', this.cursos);
    if (this.cursos.length > 0) {
      // Puedes iniciar qrData con la sección del primer curso
      this.qrData = this.cursos[0].seccion;
    }
  }

  // Método para cambiar qrData cuando se selecciona un curso
  onSelectCourse(course: any) {
    this.qrData = course.seccion;
    console.log('QR Data para el curso seleccionado:', this.qrData); // Verifica el valor de qrData
  }




  loadData(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      const newItems = [];
      const currentLength = this.items.length;
      if (currentLength < 30) {
        for (let i = currentLength + 1; i <= Math.min(currentLength + 10, 30); i++) {
          newItems.push(`Estudiante ${i}`);
        }
        this.items.push(...newItems);
      }
      event.target.complete();
    }, 500);
  }

  addStudent() {
    console.log('Agregar nuevo estudiante');
  }

  viewLocation(student: string) {
    console.log('Ver ubicación de:', student);
  }

  async editStudent(student: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea editar este estudiante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Editar',
          handler: () => {
            console.log('Editar estudiante:', student);
            this.router.navigate(['/add-alum']); // Ejemplo de redirección
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteStudent(student: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar este estudiante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.items = this.items.filter(s => s !== student);
            console.log('Eliminar estudiante:', student);
          },
        },
      ],
    });

    await alert.present();
  }
}
