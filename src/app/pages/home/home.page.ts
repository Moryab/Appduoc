import { Component, OnInit } from '@angular/core';
import { Menulink } from 'src/app/interfaces/menulink';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  links:Menulink[]=[

    {
      link:'/alertas',
      icono:'warning-outline',
      label:'alertas'
    },

    {
      link:'/formulario',
      icono:'reader-outline',
      label:'formulario'
    }

  ]

  constructor() { }

  ngOnInit() {
  }

}
