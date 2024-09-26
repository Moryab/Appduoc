import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-asistencia-estud',
  templateUrl: './asistencia-estud.page.html',
  styleUrls: ['./asistencia-estud.page.scss'],
})
export class AsistenciaEstudPage implements OnInit {
  items: string[] = [];

  constructor() { }

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


  
}
