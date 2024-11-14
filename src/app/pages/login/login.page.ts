import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/usuario';
import { AlmacenamientoService } from 'src/app/services/almacenamiento.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usr: UsuarioLog = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private dba: AlmacenamientoService
  ) {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async iniciar_sesion() {
    if (this.usr) {

      // Mostrar el loading
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn({
        email: this.usr.email,
        password: this.usr.password,
      })
        .then(async (userCredential) => {
          console.log('Inicio de sesión exitoso:', userCredential);

          // Guardar la información del usuario en localStorage
          const usuarioData = {
            uid: userCredential.user?.uid,
            email: this.usr.email
          };
          await this.dba.guardarUsuario(usuarioData);

          // Redirigir según el dominio del correo electrónico
          if (this.usr.email.endsWith('@duocuc.cl')) {
            this.router.navigate(['/asistencia-estud']);
          } else if (this.usr.email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/cursos']);
          } else {
            console.warn('Dominio no reconocido');
            this.alerta();
          }

        })
        .catch((error) => {
          console.error('Error en el inicio de sesión:', error);
          this.alerta();
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async alerta() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      subHeader: 'Usuario y/o contraseña incorrecta',
      message: 'Vuelva a intentar',
      backdropDismiss: false,
      buttons: [{
        text: "Aceptar",
        cssClass: 'btn-login',
        handler: () => {}
      }],
    });

    await alert.present();
  }
}
