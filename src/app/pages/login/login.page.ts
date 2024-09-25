import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usr:UsuarioLog={
    username:'',
    password:''

  }
  

  constructor(private router:Router, private alertController:AlertController) { }

  ngOnInit() {
  }

  iniciar_sesion() {
    // Usuario Alumno
    if (this.usr.username === "user" && this.usr.password === "123") {
      this.router.navigate(["/home"]);
    // Usuario Profesor
    } else if (this.usr.username === "profeduoc" && this.usr.password === "123") {
      this.router.navigate(["/cursos"]);
    } else {
      this.alerta();
    }
  }
  


  async alerta(){

   
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      subHeader: 'Usuario y/o contraseña incorrecta',
      message: 'vuelva a intentar',
      backdropDismiss:false,
      buttons: [ {
        text:"Aceptar",
        cssClass:'btn-login',
        handler:()=>{
        }
      },],
    });

    await alert.present();
  }

}
