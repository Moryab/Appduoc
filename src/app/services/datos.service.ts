import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ialumnos } from '../interfaces/ialumnos';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  constructor(private httpclient:HttpClient) { }
  
  getAlumnos(cantidad: number) {
    return this.httpclient.get<Ialumnos>(`https://randomuser.me/api?results=${cantidad}`);
  }
}
