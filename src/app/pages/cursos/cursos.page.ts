import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  asistencia() {
    this.navCtrl.navigateForward('/home');
  }

  ngOnInit() {
  }

}
