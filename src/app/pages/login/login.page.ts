import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/usuario';
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
    private alertController: AlertController
  ) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async iniciar_sesion() {
    if (this.usr) {

      //=======Loading=================
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn({
        email: this.usr.email,
        password: this.usr.password,
      })
      .then((userCredential) => {
        console.log('Inicio de sesión exitoso:', userCredential);
        
        // Redirigir según el dominio del correo electrónico
        if (this.usr.email.endsWith('@duocuc.cl')) {
          this.router.navigate(['/curso-estud']);
        } else if (this.usr.email.endsWith('@profesor.duoc.cl')) {
          this.router.navigate(['/cursos']);
        } else {
          // Maneja el caso donde no se cumple ninguna condición
          console.warn('Dominio no reconocido');
          this.alerta();
        }

      })
      .catch((error) => {
        console.error('Error en el inicio de sesión:', error);
        this.alerta();

        // ===============USO DE TOAST=============
        // this.utilsSvc.presentToast({
        //   message: error.message,
        //   duration: 2500,
        //   color: 'primary',
        //   position: 'middle',
        //   icon: 'alert-circle-outline'
        // })

      })
      .finally(() =>{
        loading.dismiss();
      })

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
        handler: () => {
        }
      }],
    });

    await alert.present();
  }
}
