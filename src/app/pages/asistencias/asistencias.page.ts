import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Curso } from 'src/app/interfaces/usuario';  // Importa la interfaz Curso

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  asistencias: any[] = [];  // Variable para almacenar las asistencias
  items: string[] = [];
  curso: Curso;  // Curso específico que seleccionaste, usando la interfaz Curso

  constructor(
    private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService, // Inyectamos FirebaseService
  ) { }

  ngOnInit() {
    this.loadAsistencias();
  
    // Obtener el estado de navegación con detalles del curso
    const navigationState = this.router.getCurrentNavigation()?.extras.state as Curso;
  
    console.log('Datos recibidos:', navigationState);
  
    if (navigationState) {
      this.curso = {
        nombre: navigationState.nombre,
        seccion: navigationState.seccion,
        nombreProfesor: navigationState.nombreProfesor,
        sigla: navigationState.sigla,
        correo: navigationState.correo,
        fechaCreacion: navigationState.fechaCreacion
      };
    }
  }

  // Método para navegar a la página QRCode con los detalles del curso
  goToQRCode() {
    const navigationExtras: NavigationExtras = {
      state: {
        nombre: this.curso.nombre,
        seccion: this.curso.seccion,
        nombreProfesor: this.curso.nombreProfesor
      }
    };
    this.router.navigate(['/qrcode'], navigationExtras);
  }

  //guardar asistencias
  loadAsistencias() {
    // Observa los cambios en la colección de asistencias en Firestore
    this.firebaseService.firestore.collection('asistencias').valueChanges().subscribe((data: any[]) => {
      this.asistencias = data;
    });
  }

  // Método para cargar más estudiantes (si tienes un scroll infinito)
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
