import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  items: string[] = [];

  constructor(private router:Router,private alertController: AlertController) { }

  ngOnInit() {
    for (let i = 1; i <= 30; i++) {
      this.items.push(`Estudiante ${i}`);
    }
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
            // Aquí puedes redirigir a la página de edición o realizar la lógica de edición
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
