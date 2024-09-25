import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioRegister } from 'src/app/interfaces/usuario';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usr: UsuarioRegister = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    run:''
  };

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async registrar() {
    // Verifica si todos los campos están completos
    if (this.camposCompletos(this.usr)) {
      // Si todos los campos están llenos, muestra alerta de registro exitoso
      await this.alertaRegistroExitoso();
      this.router.navigate(["/login"]); // Redirige al login
    } else {
      // Si falta algún campo, muestra alerta de registro fallido
      await this.alertaRegistroFallido('Faltan campos obligatorios. Por favor, complétalos.');
    }
  }

  // Verifica si todos los campos del usuario están completos
  camposCompletos(usuario: UsuarioRegister) {
    return usuario.nombre && usuario.apellido && usuario.correo && usuario.password;
  }

  // Alerta para registro exitoso
  async alertaRegistroExitoso() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      subHeader: 'Usuario registrado correctamente',
      message: 'Ahora puedes iniciar sesión',
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
      subHeader: 'No se pudo registrar el usuario',
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
