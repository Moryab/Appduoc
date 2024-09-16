import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {

  usr:UsuarioLog={
    username:'',
    password:''

  }
  constructor(private router:Router, private alertController:AlertController) { }

  ngOnInit() {
  }

  iniciar_sesion(){
    if(this.usr.username=="user" && this.usr.password=="123"){
      this.router.navigate(["/home"]);
    }
    else{
      this.alerta();
    }
  }


  async alerta(){

   
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      subHeader: 'Usuario y/o contraseña incorrecta',
      message: 'Vuelva a intentarlo',
      backdropDismiss:false,
      buttons: [ {
        text:"Aceptar",
        cssClass:'btn-verde',
        handler:()=>{
          console.log("Apreto aceptar desde controller");
        }
      },],
    });

    await alert.present();
  }
}
