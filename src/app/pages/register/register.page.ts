import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioRegister } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usr:UsuarioRegister={
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  }

  constructor(private router:Router) { }

  ngOnInit() {
  }
  registrar() {
    // Aquí puedes manejar la lógica para registrar al usuario
    console.log('Registro:', this.usr);
    // Por ejemplo, enviar los datos a tu API o servicio
  }

}
