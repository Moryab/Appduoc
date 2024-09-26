import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-asistencia-estud',
  templateUrl: './asistencia-estud.page.html',
  styleUrls: ['./asistencia-estud.page.scss'],
})
export class AsistenciaEstudPage implements OnInit {
  items: string[] = []; // Elementos que se mostrarán en la lista
  private totalItems = 30; // Número total de elementos a mostrar
  private allItems: string[] = []; // Lista completa de items para simular una fuente de datos

  constructor() {}

  ngOnInit() {
    this.generateAllItems(); // Genera la lista completa
    this.items = this.allItems.slice(0, 10); // Carga los primeros 10 elementos
  }

  // Método para generar la lista completa de elementos
  private generateAllItems() {
    for (let i = 1; i <= this.totalItems; i++) {
      this.allItems.push(`Estudiante ${i}`); // Asegúrate de que esta línea no lance un error
    }
  }

  // Cambia el nombre del método para que coincida con el HTML
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    // Carga más elementos solo si hay más elementos disponibles
    const currentLength = this.items.length;
    if (currentLength < this.totalItems) {
      const nextItems = this.allItems.slice(currentLength, currentLength + 10); // Carga los siguientes 10 elementos
      this.items.push(...nextItems);
    }

    // Completa el evento de carga
    setTimeout(() => {
      ev.target.complete();

      // Deshabilitar el scroll infinito si se han cargado todos los elementos
      if (this.items.length >= this.totalItems) {
        ev.target.disabled = true; // Deshabilitar si se alcanzó el límite
      }
    }, 500);
  }
}
