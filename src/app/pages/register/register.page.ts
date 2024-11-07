import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioRegister } from 'src/app/interfaces/usuario';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlmacenamientoService } from 'src/app/services/almacenamiento.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usr: UsuarioRegister = {
    nombre: '',
    email: '',
    password: '',
  };

  constructor(private router: Router, 
    private alertController: AlertController,
  private dba:AlmacenamientoService) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  ngOnInit() {
  }

  async registrar() {
    if (this.usr) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp({
        nombre: this.usr.nombre,
        email: this.usr.email,
        password: this.usr.password,
      })
      .then((userCredential) => {
        // Muestra el objeto similar al que se obtiene al iniciar sesión
        console.log('Usuario registrado exitosamente:', userCredential);

        // Guarda el usuario en el almacenamiento local
        this.dba.guardar('usuario', this.usr);

        this.alertaRegistroExitoso();
        this.firebaseSvc.updateUser(this.usr.nombre);

        // Puedes redirigir al usuario a otra página aquí si lo deseas
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
        this.alertaRegistroFallido(error.message);
      })
      .finally(() =>{
        loading.dismiss();
      })
    }
  }


  // async setUserInfo(uid: string) {
  //   if (this.usr) {

  //     //=======Loading=================
  //     const loading = await this.utilsSvc.loading();
  //     await loading.present();

  //     let path = 'users/${uid}';
  //     delete this.usr.password;

  //     this.firebaseSvc.setDocument(path, this.usr).then(async res => {

  //       this.utilsSvc.saveInLocalStorage('user', this.usr)


  //       })
  //       .catch((error) => {
  //         console.error('Error al registrar usuario:', error);          
  //         this.alertaRegistroFallido(error.message);
  //       })
  //       .finally(() => {
  //         loading.dismiss();
  //       })

  //   }
  // }

  

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
