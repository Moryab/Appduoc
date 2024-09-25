import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  items: string[] = [];

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

  editStudent(student: string) {
    console.log('Editar estudiante:', student);
  }

  deleteStudent(student: string) {
    this.items = this.items.filter(s => s !== student);
    console.log('Eliminar estudiante:', student);
  }
}
