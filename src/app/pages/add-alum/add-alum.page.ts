import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioAddAlum } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-add-alum',
  templateUrl: './add-alum.page.html',
  styleUrls: ['./add-alum.page.scss'],
})
export class AddAlumPage implements OnInit {

  usr: UsuarioAddAlum = {
    nombre: '',
    segundo_nombre: '',
    apellido: '',
    segundo_apellido: '',
    correo: '',
    run: ''
  }

  constructor(private router: Router, private alertController:AlertController) { }

  ngOnInit() {}


  async registrarAlum() {
    // Verifica si todos los campos están completos
    if (this.camposCompletos(this.usr)) {
      // Si todos los campos están llenos, muestra alerta de registro exitoso
      await this.alertaRegistroExitoso();
      this.router.navigate(["/asistencias"]);
    } else {
      // Si falta algún campo, muestra alerta de registro fallido
      await this.alertaRegistroFallido('Faltan campos obligatorios. Por favor, complétalos.');
    }
  }

  // Verifica si todos los campos del usuario están completos
  camposCompletos(usuario: UsuarioAddAlum) {
    return usuario.nombre && usuario.segundo_nombre && usuario.apellido && usuario.segundo_apellido && usuario.correo && usuario.run;
  }

  // Alerta para registro exitoso
  async alertaRegistroExitoso() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso!',
      subHeader: '',
      message: 'Alumno registrado correctamente',
      backdropDismiss: false,
      buttons: [{
        text: "Aceptar",
        cssClass: 'btn-login',
        handler: () => { }
      }],
    });

    await alert.present();
  }

  // Alerta para registro fallido
  async alertaRegistroFallido(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Registro fallido',
      subHeader: 'No se pudo registrar el alumno',
      message: mensaje,
      backdropDismiss: false,
      buttons: [{
        text: "Aceptar",
        cssClass: 'btn-login',
        handler: () => { }
      }],
    });

    await alert.present();
  }
}
